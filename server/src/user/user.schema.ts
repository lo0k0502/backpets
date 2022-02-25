import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  photoId: Types.ObjectId;

  @Prop()
  points: number;

  @Prop()
  coupons: Types.ObjectId[];

  @Prop()
  refreshToken: string;

  @Prop({ required: true })
  verified: Boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);