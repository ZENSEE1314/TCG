const PokemonCard = require('../models/PokemonCard');

/**
 * Controller for Pokemon Card operations
 */
exports.searchCards = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: {
          code: 'MISSING_QUERY',
          message: 'Search query parameter "q" is required.'
        }
      });
    }

    // Simple search across card name, set name, and type
    // Note: using ILIKE for case-insensitive search in PostgreSQL
    const { rows } = await PokemonCard.search(q);

    res.status(200).json({
      count: rows.length,
      cards: rows
    });
  } catch (error) {
    console.error('Search cards error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred while searching for cards.'
      }
    });
  }
};

exports.getCardDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await PokemonCard.findById(id);

    if (!card) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'The requested Pokemon card was not found.'
        }
      });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error('Get card details error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred while retrieving card details.'
      }
    });
  }
};

exports.getPriceHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await PokemonCard.getPriceHistory(id);

    if (!history || history.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NO_HISTORY',
          message: 'No price history found for this card.'
        }
      });
    }

    res.status(200).json({
      cardId: id,
      history
    });
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred while retrieving price history.'
      }
    });
  }
};
