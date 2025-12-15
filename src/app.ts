import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Load env vars

dotenv.config();
import connectDB from './config/db'; // Import your DB connection

import rideRoutes from './routes/rideRoutes';
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';

// Load environment variables


// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));