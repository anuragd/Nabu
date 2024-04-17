const User = require('../models/User');
const { generateBadge } = require('./badgeGeneration');
const garbleMap = require('../utils/garbleMap');

// Placeholder for the actual logic to determine if the user's answer is correct.
// This should be replaced with the actual logic, possibly involving checking against a database of answers.
const isCorrectAnswer = (userLevel, userAnswer) => {
  // Placeholder logic for correct answer validation
  // This should be replaced with actual game logic to check the user's answer against the correct answer for their current level.
  // For demonstration purposes, let's assume every answer is correct.
  return true; // This should be replaced with a real check.
};

const garbleText = (text, userLevel) => {
  const clarity = Math.max(0, Math.min(100, userLevel * 5)); // Calculate clarity based on user level
  const garbleRate = 100 - clarity;
  return text.split('').map(char => {
    if (Math.random() * 100 < garbleRate) {
      return garbleMap[char] || char; // Replace with garbled character or return original
    } else {
      return char;
    }
  }).join('');
};

exports.checkAndAdvanceLevel = async (userId, userAnswer) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }
    if (isCorrectAnswer(user.currentLevel, userAnswer)) {
      let message = 'Correct answer! Level up!';
      if (user.currentLevel < 19) {
        user.currentLevel += 1;
        user.clarityPercentage = Math.min(100, user.clarityPercentage + 5); // Ensure it does not exceed 100%
        await user.save();
        console.log(`User ${user.username} advanced to level ${user.currentLevel} with clarity ${user.clarityPercentage}%.`);
      } else if (user.currentLevel === 19) {
        user.currentLevel += 1;
        user.clarityPercentage = 100; // Ensure clarity is set to 100%
        await user.save();
        await generateBadge(user._id);
        console.log(`Badge generation initiated for ${user.username}.`);
      } else {
        console.log(`User ${user.username} has already completed the final level.`);
        message = 'You have already completed the final level.';
      }
      // Garble the message based on the user's current level
      const garbledMessage = garbleText(message, user.currentLevel);
      return { success: true, message: garbledMessage, newLevel: user.currentLevel, clarityPercentage: user.clarityPercentage };
    } else {
      console.log(`User ${user.username} provided incorrect answer.`);
      // Garble the incorrect answer message as well
      const garbledMessage = garbleText('Incorrect answer. Try again!', user.currentLevel);
      return { success: false, message: garbledMessage };
    }
  } catch (error) {
    console.error('Error in advancing level:', error.message, error.stack);
    throw error;
  }
};

exports.garbleText = garbleText;