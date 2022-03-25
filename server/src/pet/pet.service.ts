import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { Pet, PetDocument } from './pet.schema';

@Injectable()
export class PetService {
    constructor(@InjectModel(Pet.name) private petModel: Model<Pet>) {}
  
    async create(mission: Pet): Promise<Pet> {
      return (new this.petModel(mission)).save();
    }
  
    async findOne(petFilterQuery: FilterQuery<PetDocument>): Promise<Pet> {
      return this.petModel.findOne(petFilterQuery).exec();
    }
  
    async findSome(petFilterQuery: FilterQuery<PetDocument>): Promise<Pet[]> {
      return this.petModel.find(petFilterQuery).lean().exec();
    }
  
    async findAll(): Promise<Pet[]> {
      return this.petModel.find().sort({ post_time: -1 }).exec();
    }
  
    async updateOne(petFilterQuery: FilterQuery<PetDocument>, mission: Partial<Pet>): Promise<Pet> {
      return this.petModel.findOneAndUpdate(petFilterQuery, mission, { new: true }).exec();
    }
  
    async deleteOne(petFilterQuery: FilterQuery<PetDocument>): Promise<Pet> {
      return this.petModel.findOneAndDelete(petFilterQuery).exec();
    }
  }
