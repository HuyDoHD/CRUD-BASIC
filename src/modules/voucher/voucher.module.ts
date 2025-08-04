import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from '../../schemas/voucher.schema';
import { Events, EventSchema } from '../../schemas/event.schema';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Voucher.name, schema: VoucherSchema },
      { name: Events.name, schema: EventSchema },
    ]),
  ],
  providers: [VoucherService],
  controllers: [VoucherController],
})
export class VoucherModule {}
