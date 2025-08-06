import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcome(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Welcome ${name} to our system!`,
      template: './welcome', 
      context: {
        name: name,
      },
    });
  }

  async sendVoucherEmail(email: string, voucherCode: string, eventName: string) {
    console.log(email, voucherCode, eventName);
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        subject: `🎉 Your Voucher is Here!`,
        template: './voucher-issued',
        context: {
          voucherCode,
          eventName,
        },
      });
  
      console.log('✅ Email sent:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw error;
    }
  }
}
