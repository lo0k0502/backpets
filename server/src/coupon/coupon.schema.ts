import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema()
export class Coupon {
    _id: Types.ObjectId;

    @Prop({ required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    productId: Types.ObjectId;

    @Prop({ required: true })
    due_time: Number;

    @Prop({ required: true })
    exchanged: Boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);