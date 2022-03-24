import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MissionDocument = Mission & Document;

@Schema()
export class Mission {
  @Prop({ required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop()
  lost_time: string;

  @Prop()
  post_time: number;

  @Prop({ type: Object, required: true })
  location: {
    latitude: number,
    longitude: number,
  };

  @Prop()
  completed: Boolean;

  @Prop()
  chosen_clueIds: Types.ObjectId[];
}

export const MissionSchema = SchemaFactory.createForClass(Mission);