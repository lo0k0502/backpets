import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  post_time: number;

  // @Prop({ required: true })
  // location: object;

  @Prop()
  photoUrl: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);