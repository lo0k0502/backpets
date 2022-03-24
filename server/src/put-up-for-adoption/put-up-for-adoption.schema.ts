import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PutUpForAdoptionDocument = PutUpForAdoption & Document;

@Schema()
export class PutUpForAdoption {
  @Prop({ required: true })
  petId: Types.ObjectId;

  @Prop()
  content: string;

  @Prop()
  post_time: Number;

  @Prop({ type: Object, required: true })
  location: {
    latitude: Number,
    longitude: Number,
  };
}

export const PutUpForAdoptionSchema = SchemaFactory.createForClass(PutUpForAdoption);