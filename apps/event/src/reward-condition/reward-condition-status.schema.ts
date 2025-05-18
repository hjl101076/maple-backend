import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RewardConditionStatus {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  rewardName: string;

  @Prop({ required: true })
  isSatisfied: boolean;
}

export type RewardConditionStatusDocument = RewardConditionStatus & Document;
export const RewardConditionStatusSchema = SchemaFactory.createForClass(
  RewardConditionStatus,
);
