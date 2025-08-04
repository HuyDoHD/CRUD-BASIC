import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Kết nối MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';
    await mongoose.connect(mongoURI, {
      // Tùy chọn theo mongoose 6+ thì không cần options này nữa
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    logger.log('✅ MongoDB connected');

    // Khởi tạo Nest app
    const app = await NestFactory.create(AppModule);

    // Bật CORS nếu cần
    app.enableCors();

    // Lấy port từ env hoặc mặc định 3000
    const port = process.env.PORT || 3000;

    const config = new DocumentBuilder()
      .setTitle('My API') // Tiêu đề API
      .setDescription('API description') // Mô tả
      .setVersion('1.0') // Version API
      .addBearerAuth() // Nếu dùng JWT Bearer token (tuỳ chọn)
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('swagger', app, document); // URL truy cập swagger: /swagger

    await app.listen(port);

    logger.log(`🚀 Server running at http://localhost:${port}`);
  } catch (error) {
    logger.error('❌ Failed to start application', error);
    process.exit(1);
  }
}
bootstrap();
