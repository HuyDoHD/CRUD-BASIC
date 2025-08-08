import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { auditPlugin } from 'src/modules/audit/audit.plugin';

export type EventDocument = Document & Events;

@Schema({ collection: 'events', timestamps: true })
export class Events {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  maxQuantity: number;

  @Prop({ type: Number, default: 0 }) // số voucher đã phát hành
  issued: number;

  @Prop({ type: String, default: null })
  editingUserId: string | null;

  @Prop({ type: Date, default: null })
  editingExpiresAt: Date | null;
}

export const EventSchema = SchemaFactory.createForClass(Events);
EventSchema.plugin(auditPlugin, { modelName: 'events' });
