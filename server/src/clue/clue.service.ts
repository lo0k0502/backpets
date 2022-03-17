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
    
    async findOne(userFilterQuery: FilterQuery<ClueDocument>): Promise<Clue> {
        return this.clueModel.findOne(userFilterQuery).exec();
    }

    async findSome(userFilterQuery: FilterQuery<ClueDocument>): Promise<Clue[]> {
        return this.clueModel.find(userFilterQuery).exec();
    }

    async findAll(): Promise<Clue[]> {
        return this.clueModel.find().sort({ post_time: -1 }).exec();
    }
    
    async updateOne(userFilterQuery: FilterQuery<ClueDocument>, clue: Partial<Clue>): Promise<Clue> {
        return this.clueModel.findOneAndUpdate(userFilterQuery, clue, { new: true }).exec();
    }
    
    async deleteOne(userFilterQuery: FilterQuery<ClueDocument>): Promise<Clue> {
        return this.clueModel.findOneAndDelete(userFilterQuery).exec();
    }
}
