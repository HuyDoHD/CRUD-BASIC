import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import * as userPayloadInterface from 'src/common/interfaces/user-payload.interface';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Post(':id/editable/me')
  requestEdit(
    @Param('id') id: string,
    @CurrentUser() user: userPayloadInterface.UserPayload,
  ) {
    return this.eventService.requestEdit(id, user);
  }

  @Post(':id/editable/release')
  releaseEdit(
    @Param('id') id: string,
    @CurrentUser() user: userPayloadInterface.UserPayload,
  ) {
    return this.eventService.releaseEdit(id, user);
  }

  @Post(':id/editable/maintain')
  maintainEdit(
    @Param('id') id: string,
    @CurrentUser() user: userPayloadInterface.UserPayload,
  ) {
    return this.eventService.maintainEdit(id, user);
  }
}
