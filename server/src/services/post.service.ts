import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Post, PostDocument } from "src/models/post.schema";

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

    async create(user: Post): Promise<Post> {
      const createdUser = new this.postModel(user);
      return createdUser.save();
    }
  
    async findOne(userFilterQuery: FilterQuery<PostDocument>): Promise<Post> {
      return this.postModel.findOne(userFilterQuery);
    }
  
    async updateOne(userFilterQuery: FilterQuery<PostDocument>, user: Partial<Post>): Promise<Post> {
      return this.postModel.findOneAndUpdate(userFilterQuery, user, { new: true });
    }
  
    async findAll(): Promise<Post[]> {
      return this.postModel.find().sort({ post_time: -1 }).exec();
    }
  
    async deleteOne(userFilterQuery: FilterQuery<PostDocument>): Promise<Post> {
      return this.postModel.findOneAndDelete(userFilterQuery).exec();
    }
}