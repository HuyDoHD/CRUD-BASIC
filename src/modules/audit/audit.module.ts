import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import type { Queue } from 'bull';
import { AuditEnqueue } from './audit-enqueue.service';
import { AuditLog, AuditLogSchema } from 'src/schemas/audit.schema';
import { AuditProcessor } from './audit.processor';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }]),
    BullModule.registerQueue({
      name: 'audit',
    }),
  ],
  controllers: [AuditController],
  providers: [AuditProcessor, AuditService],
  exports: [AuditService],
})
export class AuditModule implements OnModuleInit {
  constructor(@Inject(getQueueToken('audit')) private readonly auditQueue: Queue) {}

  onModuleInit() {
    // set static queue for plugin to use
    AuditEnqueue.setQueue(this.auditQueue);
  }
}
