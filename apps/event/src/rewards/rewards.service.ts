import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from './rewards.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { Event, EventDocument } from '../cels/cel.schema';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name)
    private rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
  ) {}

  async create(createRewardDto: CreateRewardDto) {
    const event = await this.eventModel.findOne({
      name: createRewardDto.eventName,
    });
    if (!event) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }

    const duplicate = await this.rewardModel.findOne({
      name: createRewardDto.name,
      eventName: createRewardDto.eventName,
    });
    if (duplicate) {
      throw new ConflictException(
        '이미 해당 이벤트에 동일한 보상이 존재합니다.',
      );
    }

    const createdReward = new this.rewardModel({
      name: createRewardDto.name,
      quantity: createRewardDto.quantity,
      eventName: event.name,
    });
    return createdReward.save();
  }

  async findAll() {
    return this.rewardModel.find();
  }

  async findManyByName(name: string) {
    return this.rewardModel.find({ name: { $regex: name, $options: 'i' } });
  }
}
