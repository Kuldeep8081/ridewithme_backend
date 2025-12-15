import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware'; 
import Booking from '../models/Booking';
import Ride from '../models/Ride';

// 1. Book a Ride
export const bookRide = async (req: AuthRequest, res: Response) => {
  try {
    // ▼▼▼ TYPESCRIPT FIX: Guard Clause ▼▼▼
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { rideId, seatsToBook } = req.body;
    
    // Now TypeScript knows req.user is safe to use
    const passengerId = req.user.id; 

    // 1. Find the ride and atomically update seats (prevent double booking)
    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, seatsAvailable: { $gte: seatsToBook } }, 
      { $inc: { seatsAvailable: -seatsToBook } },
      { new: true }
    );

    if (!ride) {
      return res.status(400).json({ message: "Not enough seats or ride not found" });
    }

    // 2. Create the Booking Record
    const booking = new Booking({
      ride: rideId,
      passenger: passengerId,
      seatsBooked: seatsToBook
    });

    await booking.save();

    res.status(200).json({ message: "Booking Confirmed!", booking, ride });

  } catch (error) {
    res.status(500).json({ message: "Booking Failed", error });
  }
};

// 2. Get My Bookings
export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    // ▼▼▼ TYPESCRIPT FIX: Guard Clause ▼▼▼
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUserId = req.user.id;

    const bookings = await Booking.find({ passenger: currentUserId })
      .populate({
        path: 'ride',
        // Populate nested driver info so we can show it in the UI
        populate: { path: 'driver', select: 'name email rating' } 
      })
      .sort({ createdAt: -1 }); // Newest first

    res.json(bookings);

  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};