import { Feedback, FeedbackDocument } from './feedback.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class FeedbackService {
    constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>) {}

    async create(feedback: Feedback): Promise<Feedback> {
        return (new this.feedbackModel(feedback)).save();
    }

    async findOne(feedbackFilterQuery: FilterQuery<FeedbackDocument>): Promise<Feedback> {
        return this.feedbackModel.findOne(feedbackFilterQuery).exec();
    }

    async findSome(feedbackFilterQuery: FilterQuery<FeedbackDocument>): Promise<Feedback[]> {
        return this.feedbackModel.find(feedbackFilterQuery).sort({ post_time: -1 }).exec();
    }

    async findAll(): Promise<Feedback[]> {
        return this.feedbackModel.find().sort({ post_time: -1 }).exec();
    }
}
