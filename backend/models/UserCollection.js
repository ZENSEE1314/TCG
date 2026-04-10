// User Collection (Dex) model
class UserCollection {
  static async addToCollection(userId, cardId, condition = 'Near Mint', quantity = 1) {
    const { rows } = await db.query(
      `INSERT INTO user_collections 
       (user_id, card_id, condition, quantity) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, card_id) 
       DO UPDATE SET 
         condition = EXCLUDED.condition,
         quantity = user_collections.quantity + EXCLUDED.quantity,
         date_updated = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, cardId, condition, quantity]
    );
    return rows[0];
  }

  static async getGlobalMarketplace({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const { rows } = await db.query(
      `SELECT uc.*, pc.set_name, pc.set_code, pc.card_number, pc.card_name, pc.rarity, pc.image_url, u.username as seller_name
       FROM user_collections uc
       JOIN pokemon_cards pc ON uc.card_id = pc.id
       JOIN users u ON uc.user_id = u.id
       WHERE uc.is_listed = TRUE
       ORDER BY uc.date_updated DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  }

  static async getUserCollection(userId, { showListedOnly = false, page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT uc.*, pc.set_name, pc.set_code, pc.card_number, pc.card_name, pc.rarity, pc.image_url
      FROM user_collections uc
      JOIN pokemon_cards pc ON uc.card_id = pc.id
      WHERE uc.user_id = $1
    `;
    const params = [userId];

    if (showListedOnly) {
      query += ' AND uc.is_listed = TRUE';
    }

    query += ' ORDER BY uc.date_updated DESC LIMIT $2 OFFSET $3';
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
  }

  static async toggleListStatus(userId, cardId, price = null) {
    const { rows } = await db.query(
      `UPDATE user_collections 
       SET is_listed = NOT is_listed, 
           listed_price = CASE 
             WHEN NOT is_listed THEN $3 
             ELSE NULL 
           END,
           date_updated = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND card_id = $2
       RETURNING *`,
      [userId, cardId, price]
    );
    return rows[0];
  }

  static async updateCondition(userId, cardId, condition) {
    const { rows } = await db.query(
      `UPDATE user_collections 
       SET condition = $3, 
           date_updated = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND card_id = $2
       RETURNING *`,
      [userId, cardId, condition]
    );
    return rows[0];
  }

  static async removeFromCollection(userId, cardId) {
    const { rows } = await db.query(
      'DELETE FROM user_collections WHERE user_id = $1 AND card_id = $2 RETURNING *',
      [userId, cardId]
    );
    return rows[0];
  }
}

module.exports = UserCollection;