// src/modules/voucher/voucher.service.ts
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
  
  @Injectable()
  export class VoucherService {
    constructor(
      @InjectModel(Voucher.name) private voucherModel: Model<Voucher>,
      @InjectModel(Events.name) private eventModel: Model<Events>,
      @InjectConnection() private readonly connection: Connection,
    ) {}
  
    private generateCode(eventName: string, issuedNumber: number): string {
        const sanitized = eventName.trim().toUpperCase().replace(/\s+/g, '_');
        return `${sanitized}_${issuedNumber + 1}`;
    }
  
    async issueVoucher(eventId: string): Promise<Voucher> {
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
          console.log(code);
          const voucher = new this.voucherModel({
            eventId: updatedEvent._id,
            code,
          });
    
          await voucher.save({ session });
          await session.commitTransaction();
          
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
  }
  