import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestDocument = Test & Document;

@Schema()
export class Test {
    _id: Types.ObjectId;

    @Prop({ required: true })
    someThing: String;
}

export const TestSchema = SchemaFactory.createForClass(Test);