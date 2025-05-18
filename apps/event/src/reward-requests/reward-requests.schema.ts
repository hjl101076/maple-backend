import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  rewardName: string;

  @Prop({
    required: true,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING',
  })
  status: string;
}

export type RewardRequestDocument = RewardRequest & Document;
export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
