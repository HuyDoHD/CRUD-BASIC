// src/agenda/agenda.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Agenda from 'agenda';
import mongoose from 'mongoose';

@Injectable()
export class AgendaService implements OnModuleInit, OnModuleDestroy {
  private agenda: Agenda;

  async onModuleInit() {
    this.agenda = new Agenda({
      // Dùng cùng connection MongoDB của bạn (có thể dùng URI hoặc connection string)
      db: { address: process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb' },
    });

    // Định nghĩa job kiểm tra kết nối DB
    this.agenda.define('check db connection', async (job) => {
      const state = mongoose.connection.readyState; // 1 = connected
      if (state === 1) {
        console.log(`[Agenda] MongoDB connection is stable.`);
      } else {
        console.error(`[Agenda] MongoDB connection is NOT stable! State: ${state}`);
      }
    });

    // Lên lịch chạy job mỗi phút
    await this.agenda.start();
    await this.agenda.every('1 minute', 'check db connection');
  }

  async onModuleDestroy() {
    await this.agenda.stop();
  }
}
