const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// Public card routes
router.get('/', cardController.searchCards);
router.get('/:id', cardController.getCardDetails);
router.get('/:id/history', cardController.getPriceHistory);

module.exports = router;
