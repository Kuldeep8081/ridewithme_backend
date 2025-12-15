import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User'; // Import User interface if available

export interface IRide extends Document {
  // Allow driver to be an ID (when saving) or a User Object (when searching)
  driver: mongoose.Types.ObjectId | IUser; 
  
  origin: string;
  destination: string;
  date: Date;
  time: string;
  seatsAvailable: number;
  price: number;
  createdAt: Date;
}

const RideSchema: Schema = new Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  origin: { type: String, required: true, trim: true },      // trim removes accidental spaces
  destination: { type: String, required: true, trim: true }, 
  date: { type: Date, required: true },
  time: { type: String, required: true },         
  seatsAvailable: { type: Number, required: true, default: 3, min: 0 }, // prevent negative seats
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true });

// Indexing for faster search
RideSchema.index({ origin: 1, destination: 1, date: 1 });

export default mongoose.model<IRide>('Ride', RideSchema);