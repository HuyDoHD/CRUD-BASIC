import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { Events, EventSchema } from 'src/schemas/event.schema';
import { EventController } from './event.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Events.name, schema: EventSchema }])],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}