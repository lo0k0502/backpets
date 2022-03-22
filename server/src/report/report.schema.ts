import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema()
export class Report {
    @Prop()
    userId: Types.ObjectId;

    @Prop()
    content: string;

    @Prop()
    tag: string;

    @Prop()
    post_time: number;

    @Prop()
    photoId: Types.ObjectId;

    @Prop({ type: Object })
    location: {
        latitude: number,
        longitude: number,
    };
}

export const ReportSchema = SchemaFactory.createForClass(Report);