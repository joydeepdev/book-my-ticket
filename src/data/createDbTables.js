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

export const createBookingsTable = async () => {
  try {
    await pool.query(`
 CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  seat_id INT REFERENCES seats(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
    `);

    console.log('Bookings table ready');
  } catch (err) {
    console.log('Error creating bookings table:', err);
  }
};
