const UserCollection = require('../models/UserCollection');

/**
 * Controller for Marketplace operations
 */
exports.getMarketplace = async (req, res) => {
  try {
    // Fetch all cards that are listed for sale
    // We reuse the UserCollection model's logic via getUserCollection with listedOnly: true
    // Since getUserCollection is designed for a single user, we need a global marketplace query.
    // I'll implement a global search in the model or run the query here.

    const { rows } = await UserCollection.getGlobalMarketplace();

    res.status(200).json({
      count: rows.length,
      listings: rows
    });
  } catch (error) {
    console.error('Marketplace error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred while retrieving marketplace listings.'
      }
    });
  }
};

exports.toggleListing = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cardId } = req.params;
    const { price } = req.body;

    if (price === undefined && req.body.is_listed === false) {
      // Removing a price is fine if we are unlisting
    } else if (price === undefined) {
      return res.status(400).json({
        error: {
          code: 'MISSING_PRICE',
          message: 'A listed_price is required when listing a card for sale.'
        }
      });
    }

    const item = await UserCollection.toggleListStatus(userId, cardId, price);

    if (!item) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Card not found in your collection.'
        }
      });
    }

    res.status(200).json({
      message: 'Listing status updated successfully',
      item
    });
  } catch (error) {
    console.error('Toggle listing error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred while updating the listing.'
      }
    });
  }
};
