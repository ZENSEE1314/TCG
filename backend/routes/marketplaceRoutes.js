const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to browse the marketplace
router.get('/', marketplaceController.getMarketplace);

// Protected route to list/unlist your own cards
router.patch('/list/:cardId', authMiddleware, marketplaceController.toggleListing);

module.exports = router;
