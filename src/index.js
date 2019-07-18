const express = require('express')
const http = require('http')
const app = express()
const socketio = require('socket.io')

const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)

// Below can also be done by loading in path module
// and creating a variable to store public path
// const path = require('path')
// const publicDirectory = path.join(__dirname, '../public')
// then pass variable name into the command below
app.use(express.static('public'))

io.on('connection', () => {
  console.log('New web socket connection')
})

app.get('/', (req, res) => {
  console.log(req, res)
  res.send('index.html')
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}...`)
})