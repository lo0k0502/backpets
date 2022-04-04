import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback {
    @Prop({ required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    content: String;

    @Prop({ required: true })
    post_time: Number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);