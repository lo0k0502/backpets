import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { UserType } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findOne(userFilterQuery: FilterQuery<UserDocument>): Promise<User> {
    return this.userModel.findOne(userFilterQuery);
  }

  async updateOne(userFilterQuery: FilterQuery<UserDocument>, user: Partial<User>): Promise<User> {
    return this.userModel.findOneAndUpdate(userFilterQuery, user, { new: true });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async deleteOne(userFilterQuery: FilterQuery<UserDocument>): Promise<User> {
    return this.userModel.findOneAndDelete(userFilterQuery).exec();
  }
}