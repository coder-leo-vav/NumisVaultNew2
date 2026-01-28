const { query } = require('../config/db');

class Denomination {
  static async getAll() {
    const result = await query('SELECT * FROM denominations ORDER BY value');
    return result.rows;
  }

  static async getById(id) {
    const result = await query('SELECT * FROM denominations WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByValue(value) {
    const result = await query('SELECT * FROM denominations WHERE value ILIKE $1', [`%${value}%`]);
    return result.rows;
  }

  static async create(denominationData) {
    const { value, currency } = denominationData;
    const result = await query(
      'INSERT INTO denominations (value, currency) VALUES ($1, $2) RETURNING *',
      [value, currency]
    );
    return result.rows[0];
  }

  static async update(id, denominationData) {
    const { value, currency } = denominationData;
    const result = await query(
      'UPDATE denominations SET value = $1, currency = $2 WHERE id = $3 RETURNING *',
      [value, currency, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM denominations WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Denomination;