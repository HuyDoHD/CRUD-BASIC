import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument, Events } from '../../schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UserPayload } from '../../common/interfaces/user-payload.interface';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Events.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Events> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async editEvent(
    id: string,
    eventDto: Partial<Events>,
    user: UserPayload,
  ): Promise<Events> {
    const now = new Date();

    const event = await this.eventModel.findOneAndUpdate(
      {
        _id: id,
        editingUserId: user.userId,
        editingExpiresAt: { $gt: now }, // còn trong thời gian cho phép
      },
      {
        ...eventDto,
      },
      {
        new: true,
      },
    );

    if (!event) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa hoặc phiên đã hết hạn',
      );
    }

    return event;
  }

  async findAll(): Promise<Events[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Events> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async requestEdit(id: string, user: UserPayload): Promise<Events> {
    const now = new Date();
    const expireTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    const event = await this.eventModel.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { editingUserId: null },
          { editingExpiresAt: { $lt: now } },
          { editingUserId: user.userId },
        ],
      },
      {
        editingUserId: user.userId,
        editingExpiresAt: expireTime,
      },
      { new: true },
    );
    if (!event) {
      throw new NotFoundException('Event not found or already being edited');
    }
    return event;
  }

  async releaseEdit(eventId: string, user: UserPayload) {
    const event = await this.eventModel.updateOne(
      {
        _id: eventId,
        editingUserId: user.userId,
      },
      {
        editingUserId: null,
        editingExpiresAt: null,
      },
    );
    if (event.matchedCount === 0) {
      throw new NotFoundException(
        'You do not have permission to release this event',
      );
    }
    return { message: 'Edit access released successfully' };
  }

  async maintainEdit(eventId: string, user: UserPayload) {
    const now = new Date();
    const expireTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    const event = await this.eventModel.findOneAndUpdate(
      {
        _id: eventId,
        editingUserId: user.userId,
        editingExpiresAt: { $lt: expireTime },
      },
      {
        editingExpiresAt: expireTime,
      },
      { new: true },
    );
    if (!event) {
      throw new NotFoundException(
        'You do not have permission to maintain this event',
      );
    }
    return { message: 'Edit session extended successfully' };
  }
}
