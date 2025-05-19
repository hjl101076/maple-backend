import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './rewards.schema';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { Event, EventSchema } from '../events/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
