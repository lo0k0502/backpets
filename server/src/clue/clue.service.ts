import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Clue, ClueDocument } from './clue.schema';

@Injectable()
export class ClueService {
    constructor(@InjectModel(Clue.name) private clueModel: Model<Clue>) {}

    async create(clue: Clue): Promise<Clue> {
        return (new this.clueModel(clue)).save();
    }
    
    async findOne(clueFilterQuery: FilterQuery<ClueDocument>): Promise<Clue> {
        return this.clueModel.findOne(clueFilterQuery).exec();
    }

    async findSome(clueFilterQuery: FilterQuery<ClueDocument>): Promise<Clue[]> {
        return this.clueModel.find(clueFilterQuery).sort({ awarded: -1, post_time: -1 }).exec();
    }

    async findAll(): Promise<Clue[]> {
        return this.clueModel.find().sort({ post_time: -1 }).exec();
    }
    
    async updateOne(clueFilterQuery: FilterQuery<ClueDocument>, clue: Partial<Clue>): Promise<Clue> {
        return this.clueModel.findOneAndUpdate(clueFilterQuery, clue, { new: true }).exec();
    }
    
    async deleteOne(clueFilterQuery: FilterQuery<ClueDocument>): Promise<Clue> {
        return this.clueModel.findOneAndDelete(clueFilterQuery).exec();
    }
}
