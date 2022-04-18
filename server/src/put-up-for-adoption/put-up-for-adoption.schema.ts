import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PutUpForAdoptionDocument = PutUpForAdoption & Document;

@Schema()
export class PutUpForAdoption {
  _id: Types.ObjectId;

  @Prop({ required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop()
  content: string;

  @Prop({ required: true })
  post_time: Number;

  @Prop({ required: true })
  county: String;

  @Prop({ required: true })
  district: String;

  @Prop({ required: true })
  phone: String;

  @Prop({ required: true })
  completed: Boolean;

  @Prop()
  adoptedUserId: Types.ObjectId;
}

export const PutUpForAdoptionSchema = SchemaFactory.createForClass(PutUpForAdoption);