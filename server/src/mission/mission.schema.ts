import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MissionDocument = Mission & Document;

@Schema()
export class Mission {
  _id: Types.ObjectId;

  @Prop({ required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop()
  content: string;

  @Prop({ required: true })
  lost_time: string;

  @Prop({ required: true })
  post_time: Number;

  @Prop({ type: Object, required: true })
  location: {
    latitude: Number,
    longitude: Number,
  };

  @Prop({ required: true })
  completed: Boolean;
}

export const MissionSchema = SchemaFactory.createForClass(Mission);