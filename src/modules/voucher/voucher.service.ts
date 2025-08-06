import {
    Injectable,
    NotFoundException,
    HttpException,
    Inject,
  } from '@nestjs/common';
  import { InjectModel, InjectConnection } from '@nestjs/mongoose';
  import { Voucher } from '../../schemas/voucher.schema';
  import { Events } from '../../schemas/event.schema';
  import { Model, Connection } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import bull from 'bull';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { PageDto, PageMetaDto } from 'src/common/dto/page.dto';
  
  @Injectable()
  export class VoucherService {
    constructor(
      @InjectModel(Voucher.name) private voucherModel: Model<Voucher>,
      @InjectModel(Events.name) private eventModel: Model<Events>,
      @InjectConnection() private readonly connection: Connection,
      @InjectQueue('email-queue') private readonly emailQueue: bull.Queue,
    ) {
    }
  
    private generateCode(eventName: string, issuedNumber: number): string {
        const sanitized = eventName.trim().toUpperCase().replace(/\s+/g, '_');
        return `${sanitized}_${issuedNumber + 1}`;
    }
  
    async issueVoucher(eventId: string, currentUser: UserPayload): Promise<Voucher> {
      const MAX_RETRY = 3;
      let retries = 0;
  
      while (retries < MAX_RETRY) {
        const session = await this.connection.startSession();
        try {
          session.startTransaction();
  
          const updatedEvent = await this.eventModel.findOneAndUpdate(
            {
              _id: eventId,
              $expr: { $lt: ["$issued", "$maxQuantity"] },
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
          });
    
          await voucher.save({ session });
          await session.commitTransaction();

          const job = await this.emailQueue.add('send-voucher', {
            email: currentUser.email,
            code: voucher.code,
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

    async paginatedList(page: number, limit: number) {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.voucherModel.find().skip(skip).limit(limit).exec(),
        this.voucherModel.countDocuments().exec(),
      ]);
    
      const meta = new PageMetaDto({ total, page, limit });
      return new PageDto(data, meta);
    }
  }
  