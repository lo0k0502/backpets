import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MissionDocument = Mission & Document;

@Schema()
export class Mission {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop()
  tag: string;

  @Prop()
  breed: string;

  @Prop()
  feature: string;

  @Prop()
  lost_time: string;

  @Prop({ required: true })
  post_time: number;
  
  @Prop()
  photoId: Types.ObjectId;

  @Prop({ type: Object, required: true })
  location: {
    latitude: number,
    longitude: number,
  };

  @Prop()
  clueIds: Types.ObjectId[];
}

export const MissionSchema = SchemaFactory.createForClass(Mission);