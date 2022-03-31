import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClueDocument = Clue & Document;

@Schema()
export class Clue {
    @Prop()
    userId: Types.ObjectId;

    @Prop()
    missionId: Types.ObjectId;

    @Prop()
    content: string;

    @Prop()
    post_time: Number;

    @Prop()
    photoId: Types.ObjectId;

    @Prop({ type: Object })
    location: {
        latitude: Number,
        longitude: Number,
    };

    @Prop()
    awarded: Boolean;

    @Prop()
    pointsReceived: Boolean;
}

export const ClueSchema = SchemaFactory.createForClass(Clue);