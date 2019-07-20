const express = require('express')
const http = require('http')
const app = express()
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)

// Below can also be done by loading in path module
// and creating a variable to store public path
// const path = require('path')
// const publicDirectory = path.join(__dirname, '../public')
// then pass variable name into the command below
app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('New web socket connection')

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room })

    if(error) {
      return callback(error)
    }
    socket.join(user.room)

    socket.emit('message', generateMessage('Admin', 'Welcome!'))

    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the chatroom.`))

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if(user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the chatroom.`))
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    console.log(user)
    const filter = new Filter()
    if(filter.isProfane(message)) {
      return callback('Profanity is not allowed')
    }
    io.to(user.room).emit('message', generateMessage(user.username, message))
    callback()
  })

  socket.on('sendLocation', (position, cb) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${position.latitude},${position.longitude}`))
    cb()
  })
})

app.get('/', (req, res) => {
  console.log(req, res)
  res.send('index.html')
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}...`)
})