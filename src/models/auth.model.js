import pool from '../config/db.js';

export const createUser = async (username, email, password_hash) => {
  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id,username,email',
    [username, email, password_hash],
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [
    email,
  ]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

  return result.rows[0];
};
