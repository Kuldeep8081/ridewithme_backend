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
exports.searchRides = exports.publishRide = void 0;
const Ride_1 = __importDefault(require("../models/Ride"));
// 1. Publish a Ride
const publishRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ▼▼▼ TYPESCRIPT FIX: Guard Clause ▼▼▼
        // If req.user is somehow missing, stop here.
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        const { leavingFrom, goingTo, date, time, price, seats } = req.body;
        // Now TypeScript knows req.user is defined!
        const driverId = req.user.id;
        const newRide = yield Ride_1.default.create({
            driver: driverId,
            origin: leavingFrom,
            destination: goingTo,
            date: date,
            time: time,
            price: price,
            seatsAvailable: seats
        });
        res.status(201).json(newRide);
    }
    catch (error) {
        console.error("Publish Error:", error);
        res.status(500).json({ message: "Failed to publish ride", error });
    }
});
exports.publishRide = publishRide;
// 2. Search for Rides (Unchanged)
const searchRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, date, seats } = req.query;
        const query = {};
        if (from)
            query.origin = { $regex: from, $options: 'i' };
        if (to)
            query.destination = { $regex: to, $options: 'i' };
        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);
            query.date = { $gte: searchDate, $lt: nextDay };
        }
        if (seats) {
            query.seatsAvailable = { $gte: Number(seats) };
        }
        const rides = yield Ride_1.default.find(query)
            .populate('driver', 'name rating email')
            .sort({ date: 1, time: 1 });
        res.json(rides);
    }
    catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Search failed", error });
    }
});
exports.searchRides = searchRides;
