const { query } = require('../config/db');

class Coin {
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'id',
      sortOrder = 'ASC',
      countryId,
      denominationId,
      materialId,
      conditionId
    } = options;

    let queryText = `
      SELECT c.*, co.name as country_name, d.value as denomination_value, 
             m.name as material_name, cond.name as condition_name
      FROM coins c
      LEFT JOIN countries co ON c.country_id = co.id
      LEFT JOIN denominations d ON c.denomination_id = d.id
      LEFT JOIN materials m ON c.material_id = m.id
      LEFT JOIN conditions cond ON c.condition_id = cond.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND (c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (countryId) {
      queryText += ` AND c.country_id = $${paramIndex}`;
      queryParams.push(countryId);
      paramIndex++;
    }

    if (denominationId) {
      queryText += ` AND c.denomination_id = $${paramIndex}`;
      queryParams.push(denominationId);
      paramIndex++;
    }

    if (materialId) {
      queryText += ` AND c.material_id = $${paramIndex}`;
      queryParams.push(materialId);
      paramIndex++;
    }

    if (conditionId) {
      queryText += ` AND c.condition_id = $${paramIndex}`;
      queryParams.push(conditionId);
      paramIndex++;
    }

    // Add sorting
    queryText += ` ORDER BY c.${sortBy} ${sortOrder.toUpperCase()}`;

    // Add pagination
    const offset = (page - 1) * limit;
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);
    return result.rows;
  }

  static async getById(id) {
    const result = await query(
      `SELECT c.*, co.name as country_name, d.value as denomination_value, 
              m.name as material_name, cond.name as condition_name
       FROM coins c
       LEFT JOIN countries co ON c.country_id = co.id
       LEFT JOIN denominations d ON c.denomination_id = d.id
       LEFT JOIN materials m ON c.material_id = m.id
       LEFT JOIN conditions cond ON c.condition_id = cond.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(coinData) {
    const {
      name,
      description,
      year,
      country_id,
      denomination_id,
      material_id,
      condition_id,
      face_value,
      weight,
      diameter,
      thickness,
      edge,
      mint_mark,
      series,
      obverse_design,
      reverse_design,
      images,
      rarity,
      estimated_value,
      notes
    } = coinData;

    const result = await query(
      `INSERT INTO coins (
        name, description, year, country_id, denomination_id, material_id, 
        condition_id, face_value, weight, diameter, thickness, edge, 
        mint_mark, series, obverse_design, reverse_design, images, 
        rarity, estimated_value, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        name, description, year, country_id, denomination_id, material_id,
        condition_id, face_value, weight, diameter, thickness, edge,
        mint_mark, series, obverse_design, reverse_design, images,
        rarity, estimated_value, notes
      ]
    );
    return result.rows[0];
  }

  static async update(id, coinData) {
    const {
      name,
      description,
      year,
      country_id,
      denomination_id,
      material_id,
      condition_id,
      face_value,
      weight,
      diameter,
      thickness,
      edge,
      mint_mark,
      series,
      obverse_design,
      reverse_design,
      images,
      rarity,
      estimated_value,
      notes
    } = coinData;

    const result = await query(
      `UPDATE coins SET 
        name = $1, description = $2, year = $3, country_id = $4, 
        denomination_id = $5, material_id = $6, condition_id = $7, 
        face_value = $8, weight = $9, diameter = $10, thickness = $11, 
        edge = $12, mint_mark = $13, series = $14, obverse_design = $15, 
        reverse_design = $16, images = $17, rarity = $18, 
        estimated_value = $19, notes = $20
       WHERE id = $21 RETURNING *`,
      [
        name, description, year, country_id, denomination_id, material_id,
        condition_id, face_value, weight, diameter, thickness, edge,
        mint_mark, series, obverse_design, reverse_design, images,
        rarity, estimated_value, notes, id
      ]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM coins WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async count(options = {}) {
    const { search = '', countryId, denominationId, materialId, conditionId } = options;

    let queryText = 'SELECT COUNT(*) FROM coins WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (countryId) {
      queryText += ` AND country_id = $${paramIndex}`;
      queryParams.push(countryId);
      paramIndex++;
    }

    if (denominationId) {
      queryText += ` AND denomination_id = $${paramIndex}`;
      queryParams.push(denominationId);
      paramIndex++;
    }

    if (materialId) {
      queryText += ` AND material_id = $${paramIndex}`;
      queryParams.push(materialId);
      paramIndex++;
    }

    if (conditionId) {
      queryText += ` AND condition_id = $${paramIndex}`;
      queryParams.push(conditionId);
      paramIndex++;
    }

    const result = await query(queryText, queryParams);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Coin;