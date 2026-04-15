import pool from '../config/db.js';

export const bookSeatService = async (id, name, userId) => {
  const conn = await pool.connect();

  try {
    await conn.query('BEGIN');

    const sql = 'SELECT * FROM seats where id = $1 and isbooked = 0 FOR UPDATE';
    const result = await conn.query(sql, [id]);

    if (result.rowCount === 0) {
      await conn.query('ROLLBACK');
      conn.release();
      return { error: 'Seat already booked' };
    }

    const sqlU = 'update seats set isbooked = 1, name = $2 where id = $1';
    const updateResult = await conn.query(sqlU, [id, name]);

    await conn.query(
      `INSERT INTO bookings (user_id, seat_id) VALUES ($1, $2)`,
      [userId, id],
    );

    await conn.query('COMMIT');
    conn.release();

    return updateResult.rows[0] || { message: 'Seat booked successfully' };
  } catch (err) {
    await conn.query('ROLLBACK');
    conn.release();
    throw err;
  }
};

export const getSeatsService = async () => {
  return await pool.query('select * from seats');
};

export const getMyBookingService = async (id) => {
  return await pool.query(`SELECT * FROM bookings WHERE user_id = $1`, [id]);
};
