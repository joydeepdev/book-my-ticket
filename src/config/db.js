import { Pool } from 'pg';



const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, //
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
});

pool.on('connect', () => {
  console.log(`connection pool extablished with datababse`);
});

export default pool;
