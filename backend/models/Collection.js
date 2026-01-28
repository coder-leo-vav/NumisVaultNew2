const { query } = require('../config/db');

class Collection {
  static async getAll() {
    const result = await query(`
      SELECT c.*, u.username as owner_name
      FROM collections c
      LEFT JOIN users u ON c.owner_id = u.id
      ORDER BY c.name
    `);
    return result.rows;
  }

  static async getById(id) {
    const result = await query(`
      SELECT c.*, u.username as owner_name
      FROM collections c
      LEFT JOIN users u ON c.owner_id = u.id
      WHERE c.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async getByOwnerId(ownerId) {
    const result = await query(`
      SELECT c.*, u.username as owner_name
      FROM collections c
      LEFT JOIN users u ON c.owner_id = u.id
      WHERE c.owner_id = $1
      ORDER BY c.name
    `, [ownerId]);
    return result.rows;
  }

  static async create(collectionData) {
    const { name, description, owner_id } = collectionData;
    const result = await query(
      'INSERT INTO collections (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, owner_id]
    );
    return result.rows[0];
  }

  static async update(id, collectionData) {
    const { name, description, owner_id } = collectionData;
    const result = await query(
      'UPDATE collections SET name = $1, description = $2, owner_id = $3 WHERE id = $4 RETURNING *',
      [name, description, owner_id, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM collections WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Get coins in a specific collection
  static async getCoinsInCollection(collectionId) {
    const result = await query(`
      SELECT cc.*, c.*, co.name as country_name, d.value as denomination_value,
             m.name as material_name, cond.name as condition_name
      FROM collection_coins cc
      JOIN coins c ON cc.coin_id = c.id
      LEFT JOIN countries co ON c.country_id = co.id
      LEFT JOIN denominations d ON c.denomination_id = d.id
      LEFT JOIN materials m ON c.material_id = m.id
      LEFT JOIN conditions cond ON c.condition_id = cond.id
      WHERE cc.collection_id = $1
    `, [collectionId]);
    return result.rows;
  }

  // Add a coin to a collection
  static async addCoinToCollection(collectionId, coinId, quantity = 1, purchasePrice = null, purchaseDate = null, notes = null) {
    const result = await query(`
      INSERT INTO collection_coins (collection_id, coin_id, quantity, purchase_price, purchase_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (collection_id, coin_id) 
      DO UPDATE SET quantity = collection_coins.quantity + EXCLUDED.quantity
      RETURNING *
    `, [collectionId, coinId, quantity, purchasePrice, purchaseDate, notes]);
    return result.rows[0];
  }

  // Remove a coin from a collection
  static async removeCoinFromCollection(collectionId, coinId) {
    const result = await query(
      'DELETE FROM collection_coins WHERE collection_id = $1 AND coin_id = $2 RETURNING *',
      [collectionId, coinId]
    );
    return result.rows[0];
  }
}

module.exports = Collection;