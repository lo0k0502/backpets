import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  category: string;

  @Prop()
  variety: string;

  @Prop()
  feature: string;

  @Prop()
  lost_time: string;

  @Prop({ required: true })
  post_time: number;
  
  @Prop()
  photoId: Types.ObjectId;

  @Prop({ type: Object, required: true })
  location: {
    latitude: number,
    longitude: number,
  };
}

export const PostSchema = SchemaFactory.createForClass(Post);