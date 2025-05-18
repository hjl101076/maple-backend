import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from './reward-requests.schema';
import { CreateRewardRequestDto } from './dto/reward-request.dto';
import { RewardConditionService } from '../reward-condition/reward-condition.service';
import { Reward, RewardDocument } from '../rewards/rewards.schema';
import { Event, EventDocument } from '../cels/cel.schema';

@Injectable()
export class RewardRequestsService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,

    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,

    @InjectModel(Reward.name)
    private rewardModel: Model<RewardDocument>,

    private readonly rewardConditionService: RewardConditionService,
  ) {}

  // 보상 요청 생성
  async create(createDto: CreateRewardRequestDto, userEmail: string) {
    const { eventName, rewardName } = createDto;

    const event = await this.eventModel.findOne({ name: eventName });
    if (!event) {
      return { message: '이벤트가 존재하지 않습니다.', status: 'FAILED' };
    }

    const reward = await this.rewardModel.findOne({ name: rewardName });
    if (!reward) {
      return { message: '보상이 존재하지 않습니다.', status: 'FAILED' };
    }

    const meetsCondition =
      await this.rewardConditionService.checkConditionStatus(
        userEmail,
        reward.name,
      );

    if (!meetsCondition) {
      return { message: '조건을 충족하지 않았습니다.', status: 'FAILED' };
    }

    const exists = await this.rewardRequestModel.findOne({
      userEmail,
      eventName,
      rewardName,
    });

    const status = exists ? 'FAILED' : 'SUCCESS';

    await this.rewardRequestModel.create({
      userEmail,
      eventName,
      rewardName,
      status,
    });

    return {
      message: exists ? '이미 보상을 요청했습니다.' : '보상이 요청되었습니다.',
      status,
    };
  }

  async findAllWithFilter(filter: { eventId?: string; status?: string }) {
    const query: any = {};
    if (filter.eventId) query.eventId = new Types.ObjectId(filter.eventId);
    if (filter.status) query.status = filter.status;

    return this.rewardRequestModel.find(query).populate('eventId rewardId');
  }

  async findByUser(userEmail: string) {
    return this.rewardRequestModel
      .find({ userEmail })
      .populate('eventId rewardId');
  }
}
