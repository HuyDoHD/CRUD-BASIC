import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailService } from 'src/mail/mail.service';

@Processor('email-queue')
export class SendEmailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process()
  async handleEmailJob(job: Job) {
    const { to, subject, body } = job.data;
    console.log(`Sending email to ${to} with subject: ${subject}`);
    // Replace with actual email sending logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Email sent to ${to}`);
  }

  @Process('send-voucher-email')
  async handleSendVoucherEmail(job: Job) {
    const { email, voucherCode, eventName } = job.data;
    await this.mailService.sendVoucherEmail(email, voucherCode, eventName);
  }

  @Process('send-welcome-email')
  async handleSendWelcomeEmail(job: Job) {
    const { email, name } = job.data;
    await this.mailService.sendWelcome(email, name);
  }
}
