document.addEventListener("DOMContentLoaded", function () {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatDisplay = document.getElementById('chat-display');

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            // Display the user's message in the chat display area
            const userMsgDiv = document.createElement('div');
            userMsgDiv.textContent = `You: ${message}`;
            userMsgDiv.classList.add('user-message');
            chatDisplay.appendChild(userMsgDiv);

            console.log("Message sent: ", message); // Logging the message sent by the user

            // Reset input area
            chatInput.value = '';

            // Auto-scroll to the latest message
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        } else {
            console.error("Error: Message input is empty."); // Error handling for empty message input
        }
    });
});