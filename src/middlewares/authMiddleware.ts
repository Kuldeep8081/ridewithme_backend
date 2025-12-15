import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 1. Ensure this matches your authController.ts secret EXACTLY
      const secret = process.env.JWT_SECRET || 'supersecretkey';

      // 2. Verify token
      const decoded = jwt.verify(token, secret) as UserPayload;

      // 3. Attach user to request
      req.user = decoded;

      // Debug Log (Optional: Remove later)
      // console.log("✅ Auth Success for User ID:", decoded.id);

      return next();

    } catch (error) {
      console.error("❌ Token Verification Failed:", error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};