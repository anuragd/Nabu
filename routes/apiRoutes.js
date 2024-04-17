const express = require('express');
const router = express.Router();
const { checkAndAdvanceLevel } = require('../controllers/puzzleProgression');

router.post('/puzzle/advanceLevel', async (req, res) => {
  try {
    const { userId, userAnswer } = req.body;
    if (!userId || !userAnswer) {
      console.log('Missing userId or userAnswer in request');
      return res.status(400).json({ message: 'Missing userId or userAnswer in request' });
    }
    const result = await checkAndAdvanceLevel(userId, userAnswer);
    if (result.success) {
      console.log(`User ${userId} advanced to level ${result.newLevel} with clarity ${result.clarityPercentage}%.`);
      res.status(200).json(result);
    } else {
      console.log(`User ${userId} provided incorrect answer.`);
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in advancing level:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;