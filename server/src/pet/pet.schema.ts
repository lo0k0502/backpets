import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema()
export class Pet {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  tag: string;

  @Prop({ required: true })
  breed: string;

  @Prop({ required: true })
  feature: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  photoId: Types.ObjectId;

  @Prop({ required: true })
  ligated: Boolean;

  @Prop({ required: true })
  age: Number;

  @Prop()
  microchip: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);