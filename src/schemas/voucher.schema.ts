import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { auditPlugin } from 'src/modules/audit/audit.plugin';

export type VoucherDocument = Voucher & Document;

@Schema({ collection: 'vouchers', timestamps: true })
export class Voucher {
  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true })
  eventId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
VoucherSchema.plugin(auditPlugin, { modelName: 'vouchers' });