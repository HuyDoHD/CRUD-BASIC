// logger.module.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const LoggerModule = WinstonModule.forRoot({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/app.log',
      level: 'info',
    }),
  ],
});
