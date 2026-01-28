const { query } = require('../config/db');

class Country {
  static async getAll() {
    const result = await query('SELECT * FROM countries ORDER BY name');
    return result.rows;
  }

  static async getById(id) {
    const result = await query('SELECT * FROM countries WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByName(name) {
    const result = await query('SELECT * FROM countries WHERE name ILIKE $1', [`%${name}%`]);
    return result.rows;
  }

  static async create(countryData) {
    const { name, code, continent } = countryData;
    const result = await query(
      'INSERT INTO countries (name, code, continent) VALUES ($1, $2, $3) RETURNING *',
      [name, code, continent]
    );
    return result.rows[0];
  }

  static async update(id, countryData) {
    const { name, code, continent } = countryData;
    const result = await query(
      'UPDATE countries SET name = $1, code = $2, continent = $3 WHERE id = $4 RETURNING *',
      [name, code, continent, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM countries WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Country;