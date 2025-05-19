import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  condition: string; // ex) 로그인 3일, 친구 초대 등

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export type EventDocument = Event & Document;
export const EventSchema = SchemaFactory.createForClass(Event);
