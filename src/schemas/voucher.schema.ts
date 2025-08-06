import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type VoucherDocument = Voucher & Document;

@Schema({ collection: 'vouchers', timestamps: true })
export class Voucher {
  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true })
  eventId: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
