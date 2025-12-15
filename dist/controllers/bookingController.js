"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBookings = exports.bookRide = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const Ride_1 = __importDefault(require("../models/Ride"));
// 1. Book a Ride
const bookRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ▼▼▼ TYPESCRIPT FIX: Guard Clause ▼▼▼
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        const { rideId, seatsToBook } = req.body;
        // Now TypeScript knows req.user is safe to use
        const passengerId = req.user.id;
        // 1. Find the ride and atomically update seats (prevent double booking)
        const ride = yield Ride_1.default.findOneAndUpdate({ _id: rideId, seatsAvailable: { $gte: seatsToBook } }, { $inc: { seatsAvailable: -seatsToBook } }, { new: true });
        if (!ride) {
            return res.status(400).json({ message: "Not enough seats or ride not found" });
        }
        // 2. Create the Booking Record
        const booking = new Booking_1.default({
            ride: rideId,
            passenger: passengerId,
            seatsBooked: seatsToBook
        });
        yield booking.save();
        res.status(200).json({ message: "Booking Confirmed!", booking, ride });
    }
    catch (error) {
        res.status(500).json({ message: "Booking Failed", error });
    }
});
exports.bookRide = bookRide;
// 2. Get My Bookings
const getUserBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ▼▼▼ TYPESCRIPT FIX: Guard Clause ▼▼▼
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const currentUserId = req.user.id;
        const bookings = yield Booking_1.default.find({ passenger: currentUserId })
            .populate({
            path: 'ride',
            // Populate nested driver info so we can show it in the UI
            populate: { path: 'driver', select: 'name email rating' }
        })
            .sort({ createdAt: -1 }); // Newest first
        res.json(bookings);
    }
    catch (error) {
        console.error("Fetch Bookings Error:", error);
        res.status(500).json({ message: "Error fetching bookings", error });
    }
});
exports.getUserBookings = getUserBookings;
