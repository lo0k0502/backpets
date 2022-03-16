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
    photoId: Types.ObjectId;

    @Prop({ type: Object })
    location: {
        latitude: number,
        longitude: number,
    };
}

export const ClueSchema = SchemaFactory.createForClass(Clue);