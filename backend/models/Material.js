const { query } = require('../config/db');

class Material {
  static async getAll() {
    const result = await query('SELECT * FROM materials ORDER BY name');
    return result.rows;
  }

  static async getById(id) {
    const result = await query('SELECT * FROM materials WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByName(name) {
    const result = await query('SELECT * FROM materials WHERE name ILIKE $1', [`%${name}%`]);
    return result.rows;
  }

  static async create(materialData) {
    const { name, description } = materialData;
    const result = await query(
      'INSERT INTO materials (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  }

  static async update(id, materialData) {
    const { name, description } = materialData;
    const result = await query(
      'UPDATE materials SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM materials WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Material;