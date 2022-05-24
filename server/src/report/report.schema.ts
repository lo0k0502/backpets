import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema()
export class Report {
    _id: Types.ObjectId;
  
    @Prop({ required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    tag: string;

    @Prop({ required: true })
    post_time: Number;

    @Prop({ required: true })
    photoId: Types.ObjectId;

    @Prop({ required: true, type: Object })
    location: {
        latitude: Number,
        longitude: Number,
    };
}

export const ReportSchema = SchemaFactory.createForClass(Report);