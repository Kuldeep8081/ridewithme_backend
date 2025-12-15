import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Save user
    const newUser = new User({ 
        name, 
        email, 
        passwordHash 
    });
    
    const savedUser = await newUser.save();

    // ▼▼▼ PRO FIX: Generate Token immediately so they are logged in ▼▼▼
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
        token, 
        user: { 
            id: savedUser._id, 
            name: savedUser.name, 
            email: savedUser.email 
        },
        message: "User registered successfully" 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3. Generate Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
        token, 
        _id: user._id, // Send root level ID for easier frontend access
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email 
        } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};