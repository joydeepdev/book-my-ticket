import {
  bookSeatService,
  getMyBookingService,
  getSeatsService,
} from '../models/booking.model.js';
import ApiResponse from '../utils/Api-response.js';

export const bookSeat = async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.params.name;
    const userId = req.user?.id || null;

    const result = await bookSeatService(id, name, userId);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSeats = async (req, res) => {
  const result = await getSeatsService();
  res.json(result.rows);
};

export const myBookings = async (req, res) => {
  const result = await getMyBookingService(req.user.id);
  ApiResponse.ok(res, 'your bookings are', result.rows);
};
