import { PointRecord, PointRecordDocument } from './point-record.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class PointRecordService {
    constructor(@InjectModel(PointRecord.name) private pointRecordModel: Model<PointRecord>) {}

    async create(pointRecord: PointRecord): Promise<PointRecord> {
        return (new this.pointRecordModel(pointRecord)).save();
    }

    async findOne(pointRecordFilterQuery: FilterQuery<PointRecordDocument>): Promise<PointRecord> {
        return this.pointRecordModel.findOne(pointRecordFilterQuery).exec();
    }

    async findSome(pointRecordFilterQuery: FilterQuery<PointRecordDocument>): Promise<PointRecord[]> {
        return this.pointRecordModel.find(pointRecordFilterQuery).exec();
    }

    async updateOne(pointRecordFilterQuery: FilterQuery<PointRecordDocument>, pointRecord: Partial<PointRecord>): Promise<PointRecord> {
        return this.pointRecordModel.findOneAndUpdate(pointRecordFilterQuery, pointRecord, { new: true }).exec();
    }
}
