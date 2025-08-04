import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { SendEmailProcessor } from './processors/send-email.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',  // hoặc tên container Docker
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  providers: [QueueService, SendEmailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
