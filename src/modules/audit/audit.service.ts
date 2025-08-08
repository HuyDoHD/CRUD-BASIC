import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuditLog } from 'src/schemas/audit.schema';
import { Model } from 'mongoose';
import { PageAuditDto } from './dto/page-audit.dto';
import { PageDto, PageMetaDto } from 'src/common/dto/page.dto';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private readonly auditModel: Model<AuditLog>,
  ) {}

  async findByDocument(
    collectionName: string,
    documentId: string,
    limit = 50,
    page = 1,
  ) {
    return this.auditModel
      .find({ collectionName, documentId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async query(filter: any, limit = 50, page = 1) {
    return this.auditModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async pagination(query: PageAuditDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const whereCon: any = {};
    if (query.action) whereCon.action = { $regex: query.action, $options: 'i' };
    if (query.collectionName)
      whereCon.collectionName = { $regex: query.collectionName, $options: 'i' };
    if (query.performedBy) {
      whereCon['performedBy.email'] = {
        $regex: query.performedBy,
        $options: 'i',
      };
    }
    if (query.changedFields)
      whereCon.changedFields = { $regex: query.changedFields, $options: 'i' };
    if (query.createdAt) {
      const start = startOfDay(new Date(query.createdAt));
      const end = endOfDay(new Date(query.createdAt));
      console.log(start, end);
      whereCon.createdAt = { $gte: start, $lte: end };
    }
    const audits = await this.auditModel
      .find(whereCon)
      .skip(skip)
      .limit(limit)
      .exec();
    const data = audits.map((i) => ({
      ...i.toObject(),
      performedBy: i.performedBy?.email,
    }));
    const total = await this.auditModel.countDocuments(whereCon);
    const meta = new PageMetaDto({ total, page, limit });
    return new PageDto(data, meta);
  }
}
