import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  photoId: Types.ObjectId;

  @Prop({ required: true })
  points: Number;

  @Prop({ required: true })
  searchHistory: string[];

  @Prop()
  refreshToken: string;

  @Prop({ required: true })
  verified: Boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);