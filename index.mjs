import 'dotenv/config';

import express from 'express';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import pool from './src/config/db.js';
import {
  createBookingsTable,
  createSeatsTable,
} from './src/data/createDbTables.js';
import authRouter from './src/routes/auth.routes.js';
import errorMiddleware from './src/middlewares/error-middleware.js';
import { createUserTable } from './src/models/auth.model.js';
import authMiddleware from './src/middlewares/auth-middleware.js';
import bookingRouter from './src/routes/booking.routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;

const app = new express();
app.use(cors());
app.use(express.json());

//createSeatsTable
createSeatsTable();
//create user table
createUserTable();
createBookingsTable();
//routes
app.use('/api', authRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//book a seat give the seatId and your name
app.use('/', bookingRouter);

//error middleware
app.use(errorMiddleware);

app.listen(port, () => console.log('Server starting on port: ' + port));
