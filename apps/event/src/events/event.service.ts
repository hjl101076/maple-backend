import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const { name } = createEventDto;

    // 중복 체크
    const exists = await this.eventModel.findOne({ name });
    if (exists) {
      throw new BadRequestException('이미 동일한 name 이벤트가 존재합니다.');
    }

    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAll() {
    return this.eventModel.find();
  }

  async findByName(name: string) {
    return this.eventModel.find({
      name: { $regex: name, $options: 'i' },
    });
  }
}
