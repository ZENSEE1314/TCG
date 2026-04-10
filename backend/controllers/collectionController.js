const UserCollection = require('../models/UserCollection');

/**
 * Controller for User Collection operations
 */
exports.getCollection = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, listedOnly = false } = req.query;

    const collection = await UserCollection.getUserCollection(userId, {
      showListedOnly: listedOnly === 'true',
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.status(200).json({
      user_id: userId,
      collection
    });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred while retrieving your collection.'
      }
    });
  }
};

exports.addCard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cardId, condition, quantity } = req.body;

    if (!cardId) {
      return res.status(400).json({
        error: {
          code: 'MISSING_CARD_ID',
          message: 'cardId is required to add a card to your collection.'
        }
      });
    }

    const item = await UserCollection.addToCollection(
      userId,
      cardId,
      condition || 'Near Mint',
      quantity || 1
    );

    res.status(201).json({
      message: 'Card added to collection successfully',
      item
    });
  } catch (error) {
    console.error('Add card error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred while adding the card.'
      }
    });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cardId } = req.params;
    const { condition } = req.body;

    if (!condition) {
      return res.status(400).json({
        error: {
          code: 'MISSING_CONDITION',
          message: 'condition is required to update a card.'
        }
      });
    }

    const item = await UserCollection.updateCondition(userId, cardId, condition);

    if (!item) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Card not found in your collection.'
        }
      });
    }

    res.status(200).json({
      message: 'Card condition updated successfully',
      item
    });
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred while updating the card.'
      }
    });
  }
};

exports.removeCard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cardId } = req.params;

    const item = await UserCollection.removeFromCollection(userId, cardId);

    if (!item) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Card not found in your collection.'
        }
      });
    }

    res.status(200).json({
      message: 'Card removed from collection successfully'
    });
  } catch (error) {
    console.error('Remove card error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred while removing the card.'
      }
    });
  }
};
