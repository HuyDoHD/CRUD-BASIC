import { Queue } from 'bull';

export type AuditQueuePayload = {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  collectionName: string;
  documentId: string;
  changedFields?: Record<string, { old: any; new: any }>;
  performedBy?: { id?: string; email?: string };
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
};

export class AuditEnqueue {
  private static queue: Queue | null = null;

  static setQueue(q: Queue) {
    this.queue = q;
  }

  static async enqueue(payload: AuditQueuePayload) {
    if (!this.queue) {
      // fallback: optionally log to console in dev
      console.warn('Audit queue not initialized. Payload:', payload);
      return;
    }
    await this.queue.add(payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}