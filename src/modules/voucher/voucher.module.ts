import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from '../../schemas/voucher.schema';
import { Events, EventSchema } from '../../schemas/event.schema';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Voucher.name, schema: VoucherSchema },
      { name: Events.name, schema: EventSchema },
    ]),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    QueueModule,
  ],
  providers: [VoucherService],
  controllers: [VoucherController],
})
export class VoucherModule {}
