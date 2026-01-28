require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runMigrations() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'numisvault',
    password: process.env.DB_PASSWORD || '1',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'init_db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await client.query(sql);
    console.log('Database migration completed successfully!');

    // Close the connection
    await client.end();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  }
}

runMigrations();