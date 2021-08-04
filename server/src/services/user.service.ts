import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.schema';
import { UserType } from '../DTOs/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async findOne(userFilterQuery: FilterQuery<UserDocument>): Promise<User> {
    return await this.userModel.findOne(userFilterQuery);
  }

  async updateOne(userFilterQuery: FilterQuery<UserDocument>, user: Partial<User>): Promise<User> {
    return await this.userModel.findOneAndUpdate(userFilterQuery, user, { new: true });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async deleteOne(userFilterQuery: FilterQuery<UserDocument>): Promise<User> {
    return await this.userModel.findOneAndDelete(userFilterQuery);
  }
}