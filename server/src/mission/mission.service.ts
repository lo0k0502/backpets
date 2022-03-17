import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Mission, MissionDocument } from "./mission.schema";

@Injectable()
export class MissionService {
  constructor(@InjectModel(Mission.name) private missionModel: Model<Mission>) {}

  async create(mission: Mission): Promise<Mission> {
    return (new this.missionModel(mission)).save();
  }

  async findOne(userFilterQuery: FilterQuery<MissionDocument>): Promise<Mission> {
    return this.missionModel.findOne(userFilterQuery).exec();
  }

  async findSome(userFilterQuery: FilterQuery<MissionDocument>): Promise<Mission[]> {
    return this.missionModel.find(userFilterQuery).exec();
  }

  async findAll(): Promise<Mission[]> {
    return this.missionModel.find().sort({ post_time: -1 }).exec();
  }

  async updateOne(userFilterQuery: FilterQuery<MissionDocument>, mission: Partial<Mission>): Promise<Mission> {
    return this.missionModel.findOneAndUpdate(userFilterQuery, mission, { new: true }).exec();
  }

  async deleteOne(userFilterQuery: FilterQuery<MissionDocument>): Promise<Mission> {
    return this.missionModel.findOneAndDelete(userFilterQuery).exec();
  }
}