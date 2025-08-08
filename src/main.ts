import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger/swagger.config';
dotenv.config();
import { dbConfig } from './config/db.config';
import cookieParser from 'cookie-parser';

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
    app.enableCors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    });
    app.use(cookieParser());
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
