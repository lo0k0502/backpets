import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdoptionRecordDocument = AdoptionRecord & Document;

@Schema()
export class AdoptionRecord {
  _id: Types.ObjectId;

  @Prop({ required: true })
  putUpForAdoptionId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  time: Number;
}

export const AdoptionRecordSchema = SchemaFactory.createForClass(AdoptionRecord);