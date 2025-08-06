import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { SendEmailProcessor } from './processors/send-email.processor';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost', // hoặc tên container Docker
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    MailModule,
  ],
  providers: [QueueService, SendEmailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
