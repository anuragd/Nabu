const express = require('express');
const { checkAndAdvanceLevel } = require('../controllers/puzzleProgression');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { generateShareUrls } = require('../controllers/socialSharing');
const User = require('../models/User');

const router = express.Router();

router.post('/submit-answer', isAuthenticated, async (req, res) => {
  const { userId } = req.session;
  const { answer } = req.body;
  try {
    const result = await checkAndAdvanceLevel(userId, answer);
    if (result.success) {
      console.log(`User ${userId} advanced to level ${result.newLevel} with clarity ${result.clarityPercentage}%`);
    } else {
      console.log(`User ${userId} submitted an incorrect answer.`);
    }
    res.json(result);
  } catch (error) {
    console.error('Error in puzzleRoutes /submit-answer:', error);
    res.status(500).send({ success: false, message: 'An error occurred processing your answer.', error: error.message });
  }
});

router.get('/submit-answer', (req, res) => {
  console.log('Attempt to access /submit-answer via GET');
  res.status(405).send('This route is for POST requests. Please submit an answer through the game interface.');
});

// Add a route to render the sharing page
router.get('/share-badge', isAuthenticated, async (req, res) => {
  const { userId } = req.session;
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found for ID: ${userId}`);
      return res.status(404).send({ message: 'User not found.' });
    }
    if (!user.badgeGenerated) {
      console.log(`Badge not generated for user: ${user.username}`);
      return res.status(400).send({ message: 'Badge not generated yet.' });
    }
    const badgePath = `/badges/${user.username}_badge.png`; // Assuming badgePath follows this pattern
    const shareUrls = generateShareUrls(badgePath);
    res.render('shareBadge', { shareUrls });
  } catch (error) {
    console.error('Error generating share URLs in /share-badge route:', error.message, error.stack);
    res.status(500).send({ message: 'Failed to generate share URLs.', error: error.message });
  }
});

module.exports = router;