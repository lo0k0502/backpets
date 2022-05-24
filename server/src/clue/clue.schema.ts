import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClueDocument = Clue & Document;

@Schema()
export class Clue {
    _id: Types.ObjectId;

    @Prop({ required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    missionId: Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    post_time: Number;

    @Prop({ required: true })
    photoId: Types.ObjectId;

    @Prop({ required: true, type: Object })
    location: {
        latitude: Number,
        longitude: Number,
    };

    @Prop({ required: true })
    awarded: Boolean;

    @Prop({ required: true })
    pointsReceived: Boolean;
}

export const ClueSchema = SchemaFactory.createForClass(Clue);