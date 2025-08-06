import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger/swagger.config';
dotenv.config();
import { dbConfig } from './config/db.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    await dbConfig();
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    // Bật CORS nếu cần
    app.enableCors();

    // Lấy port từ env hoặc mặc định 3000
    const port = process.env.PORT || 3000;

    setupSwagger(app);

    await app.listen(port);

    logger.log(`🚀 Server running at http://localhost:${port}`);
  } catch (error) {
    logger.error('❌ Failed to start application', error);
    process.exit(1);
  }
}
bootstrap();
