const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async getAll() {
    const result = await query('SELECT id, username, email, first_name, last_name, is_active, created_at, updated_at FROM users ORDER BY username');
    return result.rows;
  }

  static async getById(id) {
    const result = await query('SELECT id, username, email, first_name, last_name, is_active, created_at, updated_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async getByUsername(username) {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  static async create(userData) {
    const { username, email, password, first_name, last_name } = userData;
    
    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const result = await query(
      'INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, first_name, last_name, created_at, updated_at',
      [username, email, passwordHash, first_name, last_name]
    );
    return result.rows[0];
  }

  static async update(id, userData) {
    const { username, email, password, first_name, last_name, is_active } = userData;
    
    let queryText = 'UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, is_active = $5';
    const queryParams = [username, email, first_name, last_name, is_active];
    
    // If password is provided, hash it and include in update
    if (password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      queryText += ', password_hash = $6 WHERE id = $7 RETURNING id, username, email, first_name, last_name, is_active, created_at, updated_at';
      queryParams.push(passwordHash, id);
    } else {
      queryText += ' WHERE id = $6 RETURNING id, username, email, first_name, last_name, is_active, created_at, updated_at';
      queryParams.push(id);
    }
    
    const result = await query(queryText, queryParams);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id, username, email', [id]);
    return result.rows[0];
  }

  static async comparePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }
}

module.exports = User;