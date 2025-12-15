"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// ▼▼▼ CRITICAL FIX: Add 'protect' here ▼▼▼
// This ensures req.user exists so we know WHO is booking the ride.
router.post('/book', authMiddleware_1.protect, bookingController_1.bookRide);
// GET /api/bookings/user/:userId
router.get('/user/:userId', authMiddleware_1.protect, bookingController_1.getUserBookings);
exports.default = router;
