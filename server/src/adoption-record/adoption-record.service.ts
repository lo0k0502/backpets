import { AdoptionRecord, AdoptionRecordDocument } from './adoption-record.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class AdoptionRecordService {
    constructor(@InjectModel(AdoptionRecord.name) private adoptionRecordModel: Model<AdoptionRecord>) {}

    async create(adoptionRecord: AdoptionRecord): Promise<AdoptionRecord> {
        return (new this.adoptionRecordModel(adoptionRecord)).save();
    }

    async findOne(adoptionRecordFilterQuery: FilterQuery<AdoptionRecordDocument>): Promise<AdoptionRecord> {
        return this.adoptionRecordModel.findOne(adoptionRecordFilterQuery).exec();
    }

    async findSome(adoptionRecordFilterQuery: FilterQuery<AdoptionRecordDocument>): Promise<AdoptionRecord[]> {
        return this.adoptionRecordModel.find(adoptionRecordFilterQuery).sort({ time: -1 }).exec();
    }

    async updateOne(adoptionRecordFilterQuery: FilterQuery<AdoptionRecordDocument>, adoptionRecord: Partial<AdoptionRecord>): Promise<AdoptionRecord> {
        return this.adoptionRecordModel.findOneAndUpdate(adoptionRecordFilterQuery, adoptionRecord, { new: true }).exec();
    }
}
