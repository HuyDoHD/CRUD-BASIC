import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from 'src/schemas/audit.schema';

@Processor('audit')
export class AuditProcessor {
  constructor(@InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLog>) {}

  @Process()
  async handleAudit(job: Job) {
    const payload = job.data;
    try {
      await this.auditLogModel.create({
        action: payload.action,
        collectionName: payload.collectionName,
        documentId: payload.documentId,
        changedFields: payload.changedFields,
        performedBy: payload.performedBy,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        createdAt: payload.timestamp ? new Date(payload.timestamp) : undefined,
      });
    } catch (err) {
      console.error('Failed to write audit log', err);
      throw err; // let Bull handle retry policy
    }
  }
}
