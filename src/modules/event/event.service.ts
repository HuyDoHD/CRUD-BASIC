import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument, Events,  } from 'src/schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Events.name) private eventModel: Model<EventDocument>) {}

  async create(createEventDto: CreateEventDto): Promise<Events> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
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
}