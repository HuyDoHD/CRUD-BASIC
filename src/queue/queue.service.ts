import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import type { Queue } from "bull";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email-queue') private emailQueue: Queue,
  ) {}

  async sendEmailJob(to: string, subject: string, body: string) {
    await this.emailQueue.add({ to, subject, body });
  }
}