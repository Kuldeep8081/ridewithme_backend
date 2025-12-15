import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // 1. Grab the URI
    const rawURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blablaclone';

    // 2. DEBUG LOG: Print which one is being used
    // (This hides your password so it's safe to view)
    const maskedURI = rawURI.replace(/:([^:@]{1,})@/, ':****@');
    console.log(`🔌 Attempting to connect to: ${maskedURI}`);

    // 3. Connect
    const conn = await mongoose.connect(rawURI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error('❌ DB Connection Error:', error);
    process.exit(1); 
  }
};

export default connectDB;