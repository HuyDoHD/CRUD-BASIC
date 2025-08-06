import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email-queue') private emailQueue: Queue) {}

  async sendVoucherEmailJob(data: {
    email: string;
    voucherCode: string;
    eventName: string;
  }) {
    await this.emailQueue.add('send-voucher-email', data);
  }
}
