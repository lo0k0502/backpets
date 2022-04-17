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

  async findOne(missionFilterQuery: FilterQuery<MissionDocument>): Promise<Mission> {
    return this.missionModel.findOne(missionFilterQuery).exec();
  }

  async findSome(missionFilterQuery: FilterQuery<MissionDocument>): Promise<Mission[]> {
    return this.missionModel.find(missionFilterQuery).sort({ completed: 1, post_time: -1 }).exec();
  }

  async findAll(): Promise<Mission[]> {
    return this.missionModel.find().sort({ post_time: -1 }).exec();
  }

  async updateOne(missionFilterQuery: FilterQuery<MissionDocument>, mission: Partial<Mission>): Promise<Mission> {
    return this.missionModel.findOneAndUpdate(missionFilterQuery, mission, { new: true }).exec();
  }

  async deleteOne(missionFilterQuery: FilterQuery<MissionDocument>): Promise<Mission> {
    return this.missionModel.findOneAndDelete(missionFilterQuery).exec();
  }
}