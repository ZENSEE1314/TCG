const axios = require('axios');
const PokemonCard = require('../models/PokemonCard');

/**
 * Controller for Pokemon Card operations with TCG API integration
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

    // 1. Try searching our local database first for performance
    const localCards = await PokemonCard.search(q);

    // 2. Fetch from official Pokemon TCG API for real-time data
    // Using public API (no key required for basic requests, but key is better)
    const tcgApiResponse = await axios.get(`https://api.pokemontcg.io/v2/cards`, {
      params: { q: q }
    });
    const remoteCards = tcgApiResponse.data.data;

    // 3. Map remote cards to our internal format
    const integratedCards = remoteCards.map(card => ({
      externalId: card.id,
      card_name: card.name,
      set_name: card.set?.name,
      set_code: card.set?.id,
      card_number: card.number,
      rarity: card.rarity,
      card_type: card.types?.[0],
      image_url: card.images?.small,
      price: card.tcgplayer?.prices?.holofoil || card.tcgplayer?.prices?.normal || 'N/A'
    }));

    res.status(200).json({
      count: integratedCards.length,
      cards: integratedCards,
      source: 'integrated_tcg_api'
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

    // Check if it's a local ID (integer) or a remote ID (uuid)
    if (!isNaN(id)) {
      const card = await PokemonCard.findById(id);
      if (card) return res.status(200).json(card);
    }

    // Fallback to official API
    const tcgApiResponse = await axios.get(`https://api.pokemontcg.io/v2/cards/${id}`);
    const card = tcgApiResponse.data.data;

    res.status(200).json({
      ...card,
      isLocal: false
    });
  } catch (error) {
    console.error('Get card details error:', error);
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'The requested Pokemon card was not found in our system or the official API.'
      }
    });
  }
};

exports.getPriceHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Price history is currently only supported for local cards
    if (isNaN(id)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_ID',
          message: 'Price history is only available for cards in our local database.'
        }
      });
    }

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
