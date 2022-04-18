import { Test, TestDocument } from './app.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class AppService {
    constructor(@InjectModel(Test.name) private testModel: Model<Test>) {}

    async create(test: Test): Promise<Test> {
        return (new this.testModel(test)).save();
    }

    async findOne(testFilterQuery: FilterQuery<TestDocument>): Promise<Test> {
        return this.testModel.findOne(testFilterQuery).exec();
    }

    async findAll(): Promise<Test[]> {
        return this.testModel.find().exec();
    }
}
