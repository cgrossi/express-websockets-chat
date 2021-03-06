const users = []

const addUser = ({ id, username, room }) => {

  // Clean inputs
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // Validate data
  if(!username || !room) {
    return {
      error: 'A username and room must be provided'
    }
  }

  // Check for existing user
  const existingUser = users.find(user => {
    return user.username === username && user.room === room
  })

  if(existingUser) {
    return {
      error: 'Username is in use!'
    }
  }

  const user = {
    id,
    username,
    room
  }
  users.push(user)

  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex(user => {
    return user.id === id
  })

  if(index !== -1) {
    return users.splice(index, 1)[0]
  }

}

const getUser = (id) => users.find(user => user.id === id)


const getUsersInRoom = (room) => users.filter(user => user.room === room)

const getActiveRooms = () => {
  const activeRooms = []
  if(users) {
    users.forEach(user => {
      if(!activeRooms.includes(user.room)) {
        activeRooms.push({room: user.room})
      }
    })
    return activeRooms
  }
}


module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getActiveRooms
}