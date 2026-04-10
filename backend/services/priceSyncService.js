const axios = require('axios');
const PokemonCard = require('../models/PokemonCard');

/**
 * PriceSyncService
 * Responsible for updating the local database with the latest market prices from the TCG API.
 */
class PriceSyncService {
  static async syncAllPrices() {
    console.log('Starting global price sync...');

    // 1. Get all cards we are tracking in our DB
    const { rows: cards } = await PokemonCard.getAllCards();

    let updatesCount = 0;
    let errorsCount = 0;

    for (const card of cards) {
      try {
        // 2. Fetch latest price from official TCG API
        const response = await axios.get(`https://api.pokemontcg.io/v2/cards/${card.external_id || card.id}`);
        const tcgData = response.data.data;

        const currentMarketPrice = tcgData.tcgplayer?.prices?.holofoil ||
                                 tcgData.tcgplayer?.prices?.normal ||
                                 tcgData.tcgplayer?.prices?.reverseHolofoil;

        if (currentMarketPrice) {
          // 3. Record this price in the history table
          await PokemonCard.addPriceRecord(card.id, currentMarketPrice, 'TCGPlayer');
          updatesCount++;
        }
      } catch (error) {
        console.error(`Failed to sync price for card ${card.id}:`, error.message);
        errorsCount++;
      }
    }

    console.log(`Price sync complete. Updated: ${updatesCount}, Errors: ${errorsCount}`);
    return { updatesCount, errorsCount };
  }
}

module.exports = PriceSyncService;
