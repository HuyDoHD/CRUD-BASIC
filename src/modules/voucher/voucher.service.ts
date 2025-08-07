import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Voucher } from '../../schemas/voucher.schema';
import { Events } from '../../schemas/event.schema';
import { Model, Connection } from 'mongoose';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { PageDto, PageMetaDto } from 'src/common/dto/page.dto';
import { QueueService } from 'src/queue/queue.service';
import { PageVoucherDto } from './dto/page-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name) private voucherModel: Model<Voucher>,
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectConnection() private readonly connection: Connection,
    private readonly queueService: QueueService,
  ) {}

  private generateCode(eventName: string, issuedNumber: number): string {
    const sanitized = eventName.trim().toUpperCase().replace(/\s+/g, '_');
    return `${sanitized}_${issuedNumber + 1}`;
  }

  async issueVoucher(
    eventId: string,
    currentUser: UserPayload,
  ): Promise<Voucher> {
    const MAX_RETRY = 3;
    let retries = 0;

    while (retries < MAX_RETRY) {
      const session = await this.connection.startSession();
      try {
        session.startTransaction();

        const updatedEvent = await this.eventModel.findOneAndUpdate(
          {
            _id: eventId,
            $expr: { $lt: ['$issued', '$maxQuantity'] },
          },
          {
            $inc: { issued: 1 },
          },
          {
            new: false,
            session,
          },
        );
        if (!updatedEvent) {
          throw new HttpException('Voucher limit exceeded', 456);
        }

        const code = this.generateCode(updatedEvent.name, updatedEvent.issued);
        const voucher = new this.voucherModel({
          eventId: updatedEvent._id,
          code,
          userId: currentUser.userId,
        });

        await voucher.save({ session });
        await session.commitTransaction();

        await this.queueService.sendVoucherEmailJob({
          email: currentUser.email,
          voucherCode: voucher.code,
          eventName: updatedEvent.name,
        });

        return voucher;
      } catch (err) {
        await session.abortTransaction();

        // Retry only for transient transaction errors
        if (err.hasErrorLabel?.('TransientTransactionError')) {
          retries++;
        } else {
          throw err;
        }
      } finally {
        session.endSession();
      }
    }

    throw new HttpException('Transaction failed after retries', 500);
  }

  async findAll(): Promise<Voucher[]> {
    return this.voucherModel.find().exec();
  }

  async pagination(query: PageVoucherDto, currentUser: UserPayload) {
    const skip = (query.page - 1) * query.limit;

    const whereCon: any = {};
    let eventIds: string[] | undefined = undefined;
    if (query.eventName) {
      const matchedEvents = await this.eventModel
        .find({ name: { $regex: query.eventName, $options: 'i' } }, { _id: 1 })
        .lean();
      eventIds = matchedEvents.map((e) => e._id.toString());
      whereCon.eventId = { $in: eventIds };
    }
    if (query.code) whereCon.code = { $regex: query.code, $options: 'i' };

    const [data, total] = await Promise.all([
      this.voucherModel
        .find({ ...whereCon, userId: currentUser.userId })
        .skip(skip)
        .limit(query.limit)
        .lean(),
      this.voucherModel.countDocuments({
        ...whereCon,
        userId: currentUser.userId,
      }),
    ]);
    eventIds = data.map((voucher: any) => voucher.eventId.toString());
    const events = await this.eventModel
      .find({ _id: { $in: eventIds } }, { _id: 1, name: 1 })
      .lean();
    const eventMap = new Map(events.map((e) => [e._id.toString(), e.name]));
    data.forEach((voucher: any) => {
      voucher.eventName = eventMap.get(voucher.eventId.toString()) || '';
    });

    const meta = new PageMetaDto({
      total,
      page: query.page,
      limit: query.limit,
    });
    return new PageDto(data, meta);
  }

  async delete(id: string) {
    return await this.voucherModel.deleteOne({ _id: id }).exec();
  }
}
