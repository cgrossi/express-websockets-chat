const socket = io()

// Elements
const $messageForm = document.querySelector('form')
const $messageFormInput = $messageForm.querySelector('form input')
const $messageFormButton = $messageForm.querySelector('form button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $chatMessages = document.querySelector('.chat__message')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#userlist-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
  // Get new message element
  const $newMessage = $chatMessages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  console.log($chatMessages)

  // Visible height
  const visibleHeight = $chatMessages.offsetHeight

  // Height of messages container
  const containerHeight = $chatMessages.scrollHeight

  // How far have you scrolled?
  const scrollOffset = $chatMessages.scrollTop + visibleHeight
  console.log($chatMessages.scrollTop)
  console.log(visibleHeight, containerHeight, newMessageHeight, scrollOffset)

  if(containerHeight - newMessageHeight <= scrollOffset) {
    $chatMessages.scrollTop = $chatMessages.scrollHeight
  }

}

socket.on('message', (message) => {
  console.log(message.text)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)

  autoscroll()
})

socket.on('locationMessage', (message) => {
  console.log(message)
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)

  autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  $messageFormButton.setAttribute('disabled', 'disabled')
  const message = e.target.elements.message.value
  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
    if(error) {
      return console.log(error)
    }

    console.log('Message delivered!')
  })
})

$sendLocationButton.addEventListener('click', () => {
  if(!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  }
  
  $sendLocationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {longitude: position.coords.longitude, latitude: position.coords.latitude}, () => {
      $sendLocationButton.removeAttribute('disabled')
      console.log('Location sent!')
    })
  })
})

socket.emit('join', {username, room}, (error) => {
  if(error) {
    alert(error)
    location.href = '/'
  }
})

socket.on('roomData', ({room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})
