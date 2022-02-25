import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MissionDocument = Mission & Document;

@Schema()
export class Mission {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  category: string;

  @Prop()
  variety: string;

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
}

export const MissionSchema = SchemaFactory.createForClass(Mission);