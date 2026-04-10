const express = require('express');
const router = express.Router();
const arbitrageController = require('../controllers/arbitrageController');
const authMiddleware = require('../middleware/authMiddleware');

// Only admins or verified users should access arbitrage data
router.get('/opportunities', authMiddleware, arbitrageController.getArbitrageOpportunities);

module.exports = router;
