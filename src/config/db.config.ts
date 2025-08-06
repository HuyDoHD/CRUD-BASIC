import mongoose, { ConnectOptions } from 'mongoose';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

export const dbConfig = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};
