const socket = io()

// Templates

const activeRoomTemplate = document.querySelector('#active-room-template').innerHTML

// Elements
const $roomDropdown = document.querySelector('#activeRooms')
const $roomField = document.querySelector('#room-field')

socket.on('activeRooms', ({rooms}) => {
  const html = Mustache.render(activeRoomTemplate, {rooms})
  if(html) {
    $roomDropdown.innerHTML = html
  }
})

$roomDropdown.addEventListener('change', (e) => {
  $roomField.value = e.target.value
})