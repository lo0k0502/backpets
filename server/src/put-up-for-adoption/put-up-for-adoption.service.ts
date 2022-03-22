import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { PutUpForAdoption, PutUpForAdoptionDocument } from './put-up-for-adoption.schema';

@Injectable()
export class PutUpForAdoptionService {
    constructor(@InjectModel(PutUpForAdoption.name) private putUpForAdoptionModel: Model<PutUpForAdoption>) {}
  
    async create(putUpForAdoption: PutUpForAdoption): Promise<PutUpForAdoption> {
      return (new this.putUpForAdoptionModel(putUpForAdoption)).save();
    }
  
    async findOne(putUpForAdoptionFilterQuery: FilterQuery<PutUpForAdoptionDocument>): Promise<PutUpForAdoption> {
      return this.putUpForAdoptionModel.findOne(putUpForAdoptionFilterQuery).exec();
    }
  
    async findSome(putUpForAdoptionFilterQuery: FilterQuery<PutUpForAdoptionDocument>): Promise<PutUpForAdoption[]> {
      return this.putUpForAdoptionModel.find(putUpForAdoptionFilterQuery).exec();
    }
  
    async findAll(): Promise<PutUpForAdoption[]> {
      return this.putUpForAdoptionModel.find().sort({ post_time: -1 }).exec();
    }
  
    async updateOne(putUpForAdoptionFilterQuery: FilterQuery<PutUpForAdoptionDocument>, putUpForAdoption: Partial<PutUpForAdoption>): Promise<PutUpForAdoption> {
      return this.putUpForAdoptionModel.findOneAndUpdate(putUpForAdoptionFilterQuery, putUpForAdoption, { new: true }).exec();
    }
  
    async deleteOne(putUpForAdoptionFilterQuery: FilterQuery<PutUpForAdoptionDocument>): Promise<PutUpForAdoption> {
      return this.putUpForAdoptionModel.findOneAndDelete(putUpForAdoptionFilterQuery).exec();
    }
}
