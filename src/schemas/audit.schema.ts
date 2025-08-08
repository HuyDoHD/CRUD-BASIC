import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true, enum: AuditAction })
  action: AuditAction;

  @Prop({ required: true })
  collectionName: string;

  @Prop({ required: true })
  documentId: string;

  // Map of changed fields: field -> { old, new }
  @Prop({ type: Object })
  changedFields?: Record<string, { old: any; new: any }>;

  @Prop({ type: Object })
  performedBy?: { id?: string; email?: string };

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ collectionName: 1, documentId: 1 });
AuditLogSchema.index({ 'performedBy.id': 1 });
AuditLogSchema.index({ createdAt: -1 });
