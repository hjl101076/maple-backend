import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './cel.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAll() {
    return this.eventModel.find();
  }

  async findById(id: string) {
    return this.eventModel.findById(id);
  }
}
