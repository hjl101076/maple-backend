import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RewardConditionStatus,
  RewardConditionStatusDocument,
} from './reward-condition-status.schema';

@Injectable()
export class RewardConditionService {
  constructor(
    @InjectModel(RewardConditionStatus.name)
    private readonly statusModel: Model<RewardConditionStatusDocument>,
  ) {}

  async setConditionStatus(
    userEmail: string,
    rewardName: string,
    isSatisfied: boolean,
  ) {
    return this.statusModel.findOneAndUpdate(
      { userEmail, rewardName },
      { isSatisfied },
      { upsert: true, new: true },
    );
  }

  async checkConditionStatus(
    userEmail: string,
    rewardName: string,
  ): Promise<boolean> {
    const status = await this.statusModel.findOne({ userEmail, rewardName });
    return !!status?.isSatisfied;
  }

  async getAllStatus(): Promise<RewardConditionStatus[]> {
    return this.statusModel.find().exec();
  }
}
