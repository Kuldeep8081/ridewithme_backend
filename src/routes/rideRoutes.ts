import express from 'express';
// 1. Change createRide -> publishRide
import { searchRides, publishRide } from '../controllers/rideController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// GET /api/rides/search
router.get('/search', searchRides);

// POST /api/rides/publish
// 2. Use publishRide here
router.post('/publish',protect, publishRide);

export default router;