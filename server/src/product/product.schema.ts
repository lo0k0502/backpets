import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
    _id: Types.ObjectId;

    @Prop({ required: true })
    product_name: String;

    @Prop({ required: true })
    description: String;

    @Prop({ required: true })
    company_name: String;

    @Prop({ required: true })
    company_telephone: String;

    @Prop({ required: true })
    company_address: String;

    @Prop({ required: true })
    photoId: Types.ObjectId;

    @Prop({ required: true })
    points: Number;

    @Prop({ required: true })
    remaining_quantity: Number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);