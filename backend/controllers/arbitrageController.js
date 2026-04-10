const PokemonCard = require('../models/PokemonCard');
const UserCollection = require('../models/UserCollection');

/**
 * Arbitrage Engine Controller
 * Logic to identify price gaps between local/admin prices and market prices.
 */
exports.getArbitrageOpportunities = async (req, res) => {
  try {
    // 1. Get all cards listed in the marketplace
    const listings = await UserCollection.getGlobalMarketplace({ limit: 100 });

    const opportunities = [];

    for (const listing of listings) {
      // 2. Fetch current market price from TCG API (simulated/cached via PokemonCard model)
      // In a full implementation, this would hit a cache of the official TCG API prices
      const marketPrice = await getMarketPrice(listing.card_id);

      const listedPrice = parseFloat(listing.listed_price);

      if (marketPrice && listedPrice < marketPrice) {
        const profitMargin = ((marketPrice - listedPrice) / marketPrice) * 100;

        if (profitMargin > 15) { // Only flag deals with > 15% profit margin
          opportunities.push({
            card_name: listing.card_name,
            seller_name: listing.seller_name,
            listed_price: listedPrice,
            market_price: marketPrice,
            profit_margin: profitMargin.toFixed(2),
            opportunity_level: profitMargin > 30 ? 'CRITICAL' : 'HIGH',
            card_id: listing.card_id
          });
        }
      }
    }

    // Sort by highest profit margin first
    opportunities.sort((a, b) => parseFloat(b.profit_margin) - parseFloat(a.profit_margin));

    res.status(200).json({
      opportunities,
      total_found: opportunities.length
    });
  } catch (error) {
    console.error('Arbitrage error:', error);
    res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Failed to calculate arbitrage opportunities.' }
    });
  }
};

// Helper to get latest market price (Mocking the TCG API call for this logic)
async function getMarketPrice(cardId) {
  // In production, this would query the a cached price from the TCG API
  // For now, we return a simulated market price based on cardId to demonstrate the engine
  const mockPrices = {
    '1': 150.00,
    '2': 45.00,
    '3': 1200.00,
    '4': 12.00
  };
  return mockPrices[cardId] || (Math.random() * 100 + 10);
}

module.exports = { getArbitrageOpportunities };
