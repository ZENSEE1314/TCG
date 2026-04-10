const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController'); // Wait, typo in filename? Let me fix that in the tool call or a second edit.
const authMiddleware = require('../middleware/authMiddleware');

// All collection routes require authentication
router.use(authMiddleware);

router.get('/', collectionController.getCollection);
router.post('/add', collectionController.addCard);
router.patch('/:cardId', collectionController.updateCard);
router.delete('/:cardId', collectionController.removeCard);

module.exports = router;
