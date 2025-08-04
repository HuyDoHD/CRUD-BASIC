import mongoose, { ConnectOptions } from 'mongoose';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

export const dbConfig = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // Tùy chọn khuyến nghị (có thể tùy chỉnh thêm)
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions); // Tạm dùng `as any` nếu có cảnh báo TS

    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Dừng app nếu không kết nối được
  }
};
