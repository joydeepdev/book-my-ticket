import 'dotenv/config';

import express from 'express';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import {
  createBookingsTable,
  createSeatsTable,
  createUserTable,
} from './src/data/createDbTables.js';
import authRouter from './src/routes/auth.routes.js';
import errorMiddleware from './src/middlewares/error-middleware.js';

import bookingRouter from './src/routes/booking.routes.js';
import cookieParser from 'cookie-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;

const app = new express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//creating tables
const initDB = async () => {
  try {
    console.log('Initializing database...');

    await createUserTable();
    await createSeatsTable();
    await createBookingsTable();

    console.log('Database ready');
  } catch (err) {
    console.error('DB init failed ', err);
    process.exit(1); // stop app if DB fails
  }
};

await initDB();
//routes
app.use('/api', authRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//booking router
app.use('/', bookingRouter);

//error middleware
app.use(errorMiddleware);

app.listen(port, () => console.log('Server starting on port: ' + port));
