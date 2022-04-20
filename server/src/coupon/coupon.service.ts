import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Coupon, CouponDocument } from './coupon.schema';

@Injectable()
export class CouponService {
    constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}
  
    async create(coupon: Coupon): Promise<Coupon> {
      return (new this.couponModel(coupon)).save();
    }
  
    async findOne(couponFilterQuery: FilterQuery<CouponDocument>): Promise<Coupon> {
      return this.couponModel.findOne(couponFilterQuery).exec();
    }
  
    async findSome(couponFilterQuery: FilterQuery<CouponDocument>): Promise<Coupon[]> {
      return this.couponModel.find(couponFilterQuery).exec();
    }
  
    async findAll(): Promise<Coupon[]> {
      return this.couponModel.find().sort({ due_time: 1 }).exec();
    }
  
    async updateOne(couponFilterQuery: FilterQuery<CouponDocument>, coupon: Partial<Coupon>): Promise<Coupon> {
      return this.couponModel.findOneAndUpdate(couponFilterQuery, coupon, { new: true }).exec();
    }
  
    async deleteOne(couponFilterQuery: FilterQuery<CouponDocument>): Promise<Coupon> {
      return this.couponModel.findOneAndDelete(couponFilterQuery).exec();
    }
}
