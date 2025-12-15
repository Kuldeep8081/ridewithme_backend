import { Request, Response } from 'express';
import Ride from '../models/Ride';
import { AuthRequest } from '../middlewares/authMiddleware';

// 1. Publish a Ride
export const publishRide = async (req: AuthRequest, res: Response) => {
  try {
    // ▼▼▼ TYPESCRIPT FIX: Guard Clause ▼▼▼
    // If req.user is somehow missing, stop here.
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { leavingFrom, goingTo, date, time, price, seats } = req.body;
    
    // Now TypeScript knows req.user is defined!
    const driverId = req.user.id; 

    const newRide = await Ride.create({
      driver: driverId,
      origin: leavingFrom,
      destination: goingTo,
      date: date,
      time: time,
      price: price,
      seatsAvailable: seats
    });

    res.status(201).json(newRide);
  } catch (error) {
    console.error("Publish Error:", error);
    res.status(500).json({ message: "Failed to publish ride", error });
  }
};

// 2. Search for Rides (Unchanged)
export const searchRides = async (req: Request, res: Response) => {
  try {
    const { from, to, date, seats } = req.query;

    const query: any = {};
    
    if (from) query.origin = { $regex: from as string, $options: 'i' }; 
    if (to) query.destination = { $regex: to as string, $options: 'i' }; 
    
    if (date) {
        const searchDate = new Date(date as string);
        const nextDay = new Date(searchDate);
        nextDay.setDate(searchDate.getDate() + 1);
        query.date = { $gte: searchDate, $lt: nextDay };
    }

    if (seats) {
        query.seatsAvailable = { $gte: Number(seats) };
    }

    const rides = await Ride.find(query)
        .populate('driver', 'name rating email')
        .sort({ date: 1, time: 1 });

    res.json(rides);

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Search failed", error });
  }
};