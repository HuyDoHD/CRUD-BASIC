import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { Events, EventSchema } from 'src/schemas/event.schema';
import { EventController } from './event.controller';
import { Voucher, VoucherSchema } from 'src/schemas/voucher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Events.name, schema: EventSchema }, { name: Voucher.name, schema: VoucherSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
