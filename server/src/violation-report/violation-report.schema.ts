import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ViolationReportDocument = ViolationReport & Document;

@Schema()
export class ViolationReport {
    @Prop({ required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    post_type: String;

    @Prop({ required: true })
    postId: Types.ObjectId;

    @Prop({ required: true })
    category: String;

    @Prop({ required: true })
    content: String;

    @Prop({ required: true })
    post_time: Number;
}

export const ViolationReportSchema = SchemaFactory.createForClass(ViolationReport);