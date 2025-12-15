import express from 'express';
import { bookRide, getUserBookings } from '../controllers/bookingController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// ▼▼▼ CRITICAL FIX: Add 'protect' here ▼▼▼
// This ensures req.user exists so we know WHO is booking the ride.
router.post('/book', protect, bookRide);

// GET /api/bookings/user/:userId
router.get('/user/:userId', protect, getUserBookings);

export default router;