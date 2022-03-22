import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PutUpForAdoptionDocument = PutUpForAdoption & Document;

@Schema()
export class PutUpForAdoption {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop()
  content: string;

  @Prop()
  tag: string;

  @Prop()
  breed: string;

  @Prop()
  gender: string;

  @Prop()
  post_time: number;
  
  @Prop()
  photoId: Types.ObjectId;

  @Prop({ type: Object, required: true })
  location: {
    latitude: number,
    longitude: number,
  };
}

export const PutUpForAdoptionSchema = SchemaFactory.createForClass(PutUpForAdoption);