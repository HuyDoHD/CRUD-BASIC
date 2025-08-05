// src/queue/processors/send-email.processor.ts
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';

@Processor('email-queue')
export class SendEmailProcessor {
  @Process()
  async handleEmailJob(job: Job) {
    const { to, subject, body } = job.data;
    console.log(`Sending email to ${to} with subject: ${subject}`);
    // Replace with actual email sending logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Email sent to ${to}`);
  }

  @Process('send-voucher')
  async handleSendVoucher(job: Job) {
    const { email, code } = job.data;
    console.log(`📧 Sending voucher code ${code} to ${email}`);
  }
}
