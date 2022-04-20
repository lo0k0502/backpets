import { Product, ProductDocument } from './product.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}
  
    async create(product: Product): Promise<Product> {
      return (new this.productModel(product)).save();
    }
  
    async findOne(productFilterQuery: FilterQuery<ProductDocument>): Promise<Product> {
      return this.productModel.findOne(productFilterQuery).exec();
    }
  
    async findSome(productFilterQuery: FilterQuery<ProductDocument>): Promise<Product[]> {
      return this.productModel.find(productFilterQuery).exec();
    }
  
    async findAll(): Promise<Product[]> {
      return this.productModel.find().sort({ product_name: -1 }).exec();
    }
  
    async updateOne(productFilterQuery: FilterQuery<ProductDocument>, product: Partial<Product>): Promise<Product> {
      return this.productModel.findOneAndUpdate(productFilterQuery, product, { new: true }).exec();
    }
  
    async deleteOne(productFilterQuery: FilterQuery<ProductDocument>): Promise<Product> {
      return this.productModel.findOneAndDelete(productFilterQuery).exec();
    }
}
