import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type EventDocument = Events & Document;

@Schema({ collection: 'events', timestamps: true })
export class Events {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  maxQuantity: number;

  @Prop({ default: 0 }) // số voucher đã phát hành
  issued: number;
}

export const EventSchema = SchemaFactory.createForClass(Events);
