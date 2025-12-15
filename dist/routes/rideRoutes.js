"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// 1. Change createRide -> publishRide
const rideController_1 = require("../controllers/rideController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// GET /api/rides/search
router.get('/search', rideController_1.searchRides);
// POST /api/rides/publish
// 2. Use publishRide here
router.post('/publish', authMiddleware_1.protect, rideController_1.publishRide);
exports.default = router;
