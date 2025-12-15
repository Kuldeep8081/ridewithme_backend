"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // 1. Ensure this matches your authController.ts secret EXACTLY
            const secret = process.env.JWT_SECRET || 'supersecretkey';
            // 2. Verify token
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            // 3. Attach user to request
            req.user = decoded;
            // Debug Log (Optional: Remove later)
            // console.log("✅ Auth Success for User ID:", decoded.id);
            return next();
        }
        catch (error) {
            console.error("❌ Token Verification Failed:", error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
