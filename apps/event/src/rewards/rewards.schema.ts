import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Reward {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  eventName: string;
}

export type RewardDocument = Reward & Document;
export const RewardSchema = SchemaFactory.createForClass(Reward);
