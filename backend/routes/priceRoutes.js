const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const PriceSyncService = require('../services/priceSyncService');

/**
 * Manual Price Sync Trigger
 * Allows Admin to force a market refresh.
 */
router.post('/sync', authMiddleware, async (req, res) => {
  try {
    const result = await PriceSyncService.syncAllPrices();
    res.status(200).json({
      message: 'Market prices synchronized successfully',
      details: result
    });
  } catch (error) {
    console.error('Sync trigger error:', error);
    res.status(500).json({
      error: { code: 'SYNC_FAILED', message: 'Failed to trigger price synchronization.' }
    });
  }
});

module.exports = router;
