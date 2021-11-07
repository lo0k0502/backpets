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
  
  @Prop()
  photoUrl: string;

  @Prop({ type: Object, required: true })
  location: {
    latitude: number,
    longitude: number,
  };
}

export const PostSchema = SchemaFactory.createForClass(Post);