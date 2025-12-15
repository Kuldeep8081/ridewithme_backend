import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  rating: number;
  profilePic?: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>; // Optional helper
}

const UserSchema: Schema = new Schema({
  name: { 
      type: String, 
      required: true, 
      trim: true // " John " -> "John"
  },
  email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true // "User@Gmail.com" -> "user@gmail.com"
  },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  rating: { type: Number, default: 5.0 },
  profilePic: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' } // Nice default avatar
}, { timestamps: true });

// ▼▼▼ SECURITY TRICK: Never send passwordHash to Frontend ▼▼▼
// This runs automatically every time you do res.json(user)
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.__v;
  return user;
};

export default mongoose.model<IUser>('User', UserSchema);