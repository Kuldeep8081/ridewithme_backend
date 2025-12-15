import mongoose, { Schema, Document } from 'mongoose';
import { IRide } from './Ride'; // Import the Ride interface if you have it
import { IUser } from './User'; // Import the User interface if you have it

export interface IBooking extends Document {
  // Allow these to be EITHER an ID (when saving) OR a full Object (when populated)
  ride: mongoose.Types.ObjectId | IRide; 
  passenger: mongoose.Types.ObjectId | IUser;
  
  seatsBooked: number;
  status: 'confirmed' | 'cancelled';
  createdAt: Date; // Added for TS to know about timestamps
}

const BookingSchema: Schema = new Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seatsBooked: { type: Number, required: true, default: 1 },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

export default mongoose.model<IBooking>('Booking', BookingSchema);