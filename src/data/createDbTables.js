import pool from '../config/db.js';

export const createSeatsTable = async () => {
  try {
    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seats (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        isbooked INT DEFAULT 0
      )
    `);

    console.log('Seats table ready');

    // Check if seats already exist
    const result = await pool.query('SELECT COUNT(*) FROM seats');

    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO seats (isbooked)
        SELECT 0 FROM generate_series(1, 20);
      `);

      console.log('Initial seats inserted');
    } else {
      console.log('Seats already exist, skipping insert');
    }
  } catch (error) {
    console.log('Error setting up seats:', error);
  }
};

export const createUserTable = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`);
    console.log('User table created if not exist');
  } catch (error) {
    console.log('Error setting up user table', error);
  }
};
