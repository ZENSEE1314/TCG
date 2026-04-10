const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

/**
 * Credit & Quest System
 */

// Get current credits and active quests
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    // Mock Quests - in a real app, these would be in a database table
    const activeQuests = [
      { id: 'q1', title: 'Daily Scanner', description: 'Scan 3 cards today', progress: 0, reward: 5, completed: false },
      { id: 'q2', title: 'Market Mogul', description: 'List 2 cards for sale', progress: 0, reward: 10, completed: false },
      { id: 'q3', title: 'Collection Growth', description: 'Add 5 new cards to Dex', progress: 0, reward: 15, completed: false },
    ];

    res.status(200).json({
      credits: user.credits,
      quests: activeQuests
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch credit status' } });
  }
});

// Claim reward for a quest
router.post('/claim-reward', authMiddleware, async (req, res) => {
  try {
    const { questId } = req.body;

    // In a real app, verify quest completion here
    const rewards = { 'q1': 5, 'q2': 10, 'q3': 15 };
    const reward = rewards[questId] || 0;

    const user = await User.updateCredits(req.user.userId, reward);

    res.status(200).json({
      message: `Successfully claimed ${reward} credits!`,
      newBalance: user.credits
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to claim reward' } });
  }
});

// Deduct credits for AI scan
router.post('/use-credit', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.credits < 1) {
      return res.status(403).json({
        error: { code: 'INSUFFICIENT_CREDITS', message: 'You have no credits left. Watch an ad to unlock a scan!' }
      });
    }

    await User.updateCredits(req.user.userId, -1);
    res.status(200).json({ message: 'Credit deducted successfully' });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Payment processing failed' } });
  }
});

module.exports = router;
