import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PointRecordDocument = PointRecord & Document;

@Schema()
export class PointRecord {
  _id: Types.ObjectId;

  @Prop({ required: true })
  points: Number;

  @Prop()
  missionId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop()
  clueId: Types.ObjectId;

  @Prop()
  productId: Types.ObjectId;
  
  @Prop({ required: true })
  time: Number;
}

export const PointRecordSchema = SchemaFactory.createForClass(PointRecord);