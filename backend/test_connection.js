require('dotenv').config();
const { pool } = require('./config/db');

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  } finally {
    pool.end(() => {
      console.log('Database connection ended');
    });
  }
}

testConnection();