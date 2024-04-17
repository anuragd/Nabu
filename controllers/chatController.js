const garbleMap = require('../utils/garbleMap'); // Assuming garbleMap.js exports a function named garbleText
const User = require('../models/User');
const openai = require('openai');

// Setup OpenAI API
const configuration ={
  apiKey: process.env.OPENAI_API_KEY,
};
const openaiClient = new openai.OpenAI(configuration);

//Garble text based on users level
const garbleText = (text, level) => {
  let garbledText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (garbleMap[char]) {
      garbledText += garbleMap[char];
    } else {
      garbledText += char;
    }
  }
  return garbledText;
}

// Function to handle chat messages
async function handleChatMessage(socket, msg) {
  try {
    console.log(`Received message from user: ${msg}`);
    // Check if the session is available and has userId
    if (!socket.request.session || !socket.request.session.userId) {
      console.error("Session or User ID not found in session.");
      socket.emit('chatMessage', "Error: User session not found.");
      return;
    }
    // Retrieve user's current level and clarity from the database
    const user = await User.findById(socket.request.session.userId);
    if (!user) {
      console.error("User not found.");
      socket.emit('chatMessage', "Error: User not found.");
      return;
    }

    // OpenAI API call to generate Nabu's response
    const openaiResponse = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo', // Adjust based on requirements
      messages: [
        {
          role: 'user',
          content: msg
        }
      ], // User's message as the prompt
    });

    let nabuResponse = openaiResponse.choices[0].message.content.trim();
    console.log(`Nabu's original response: ${nabuResponse}`);

    // Garble Nabu's response based on user's current level
    const garbledResponse = garbleText(nabuResponse, user.level);
    console.log(`Garbled response sent to user: ${garbledResponse}`);

    // Send the garbled response back to the user
    socket.emit('chatMessage', garbledResponse);
  } catch (error) {
    console.error("Error handling chat message:", error.message);
    console.error(error.stack);
    socket.emit('chatMessage', "An error occurred while processing your message.");
  }
}

module.exports = { handleChatMessage };