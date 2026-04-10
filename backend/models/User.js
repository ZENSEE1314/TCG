// User model
class User {
  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }

  static async create({ username, email, passwordHash }) {
    const { rows } = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, passwordHash]
    );
    return rows[0];
  }

  static async updateCredits(userId, credits) {
    const { rows } = await db.query(
      'UPDATE users SET credits = $1 WHERE id = $2 RETURNING *',
      [credits, userId]
    );
    return rows[0];
  }
}

module.exports = User;