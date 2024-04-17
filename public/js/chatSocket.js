// Establishing a WebSocket connection to the server
const socket = io();

document.getElementById('chat-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const messageInput = document.getElementById('chat-input');
  const message = messageInput.value;

  if (message.trim()) {
    // Emitting a message to the server
    socket.emit('chatMessage', message);

    console.log('Message sent:', message);
  } else {
    console.log('Empty message not sent.');
  }

  // Clear the input after sending
  messageInput.value = '';
});

// Listening for messages from the server
socket.on('chatMessage', function(msg) {
  const chatDisplay = document.getElementById('chat-display');
  
  // Create a new message element
  const messageElement = document.createElement('div');
  messageElement.textContent = msg;  // This is where you might include garble logic if it was client-side
  
  // Append the new message to the chat display
  chatDisplay.appendChild(messageElement);

  // Scroll to the latest message
  chatDisplay.scrollTop = chatDisplay.scrollHeight;

  console.log('Message received:', msg);
});

socket.on('connect_error', (err) => {
  console.error('WebSocket connection error:', err.message);
});