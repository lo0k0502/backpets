import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdoptionRecordDocument = AdoptionRecord & Document;

@Schema()
export class AdoptionRecord {
  @Prop()
  putUpForAdoptionId: Types.ObjectId;

  @Prop()
  userId: Types.ObjectId;

  @Prop()
  petId: Types.ObjectId;

  @Prop()
  time: Number;
}

export const AdoptionRecordSchema = SchemaFactory.createForClass(AdoptionRecord);