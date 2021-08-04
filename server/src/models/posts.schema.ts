import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostsDocument = Posts & Document;

@Schema()
export class Posts {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  post_date: string;

  @Prop()
  photoUrl: string;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);