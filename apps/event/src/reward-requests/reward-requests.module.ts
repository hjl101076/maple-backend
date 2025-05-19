import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestSchema } from './reward-requests.schema';
import { RewardRequestsService } from './reward-requests.service';
import { RewardRequestsController } from './reward-requests.controller';
import { Event, EventSchema } from '../events/event.schema';
import { Reward, RewardSchema } from '../rewards/rewards.schema';
import { RewardConditionModule } from '../reward-condition/reward-condition.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
    RewardConditionModule,
  ],
  controllers: [RewardRequestsController],
  providers: [RewardRequestsService],
})
export class RewardRequestsModule {}
