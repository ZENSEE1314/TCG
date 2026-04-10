// Pokemon Card model
class PokemonCard {
  static async findById(id) {
    const { rows } = await db.query(
      'SELECT * FROM pokemon_cards WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  static async search(query) {
    const { rows } = await db.query(
      'SELECT * FROM pokemon_cards WHERE card_name ILIKE $1 OR set_name ILIKE $1 OR card_type ILIKE $1',
      [`%${query}%`]
    );
    return rows;
  }

  static async findBySetAndNumber(setCode, cardNumber) {
    const { rows } = await db.query(
      'SELECT * FROM pokemon_cards WHERE set_code = $1 AND card_number = $2',
      [setCode, cardNumber]
    );
    return rows[0];
  }


  static async create(cardData) {
    const { set_name, set_code, card_number, card_name, rarity, card_type, hp, image_url } = cardData;
    const { rows } = await db.query(
      `INSERT INTO pokemon_cards 
       (set_name, set_code, card_number, card_name, rarity, card_type, hp, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [set_name, set_code, card_number, card_name, rarity, card_type, hp, image_url]
    );
    return rows[0];
  }

  static async getPriceHistory(cardId, limit = 30) {
    const { rows } = await db.query(
      'SELECT * FROM price_history WHERE card_id = $1 ORDER BY date_recorded DESC LIMIT $2',
      [cardId, limit]
    );
    return rows;
  }

  static async addPriceRecord(cardId, price, source) {
    const { rows } = await db.query(
      'INSERT INTO price_history (card_id, price, source) VALUES ($1, $2, $3) RETURNING *',
      [cardId, price, source]
    );
    return rows[0];
  }
}

module.exports = PokemonCard;