import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
import {
  bookSeat,
  getSeats,
  myBookings,
} from '../controller/booking.controller.js';

const router = express.Router();

router.put('/:id/:name', authMiddleware, bookSeat);
router.get('/seats', getSeats);

router.get('/my-bookings', authMiddleware, myBookings);

export default router;
