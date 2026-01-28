const { query } = require('../config/db');

class Condition {
  static async getAll() {
    const result = await query('SELECT * FROM conditions ORDER BY name');
    return result.rows;
  }

  static async getById(id) {
    const result = await query('SELECT * FROM conditions WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByName(name) {
    const result = await query('SELECT * FROM conditions WHERE name ILIKE $1', [`%${name}%`]);
    return result.rows;
  }

  static async create(conditionData) {
    const { name, description } = conditionData;
    const result = await query(
      'INSERT INTO conditions (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  }

  static async update(id, conditionData) {
    const { name, description } = conditionData;
    const result = await query(
      'UPDATE conditions SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM conditions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Condition;