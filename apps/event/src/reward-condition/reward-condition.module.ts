import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RewardConditionStatus,
  RewardConditionStatusSchema,
} from './reward-condition-status.schema';
import { RewardConditionService } from './reward-condition.service';
import { RewardConditionController } from './reward-condition.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardConditionStatus.name, schema: RewardConditionStatusSchema },
    ]),
  ],
  providers: [RewardConditionService],
  controllers: [RewardConditionController],
  exports: [RewardConditionService],
})
export class RewardConditionModule {}
