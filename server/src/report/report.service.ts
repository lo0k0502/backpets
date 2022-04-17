import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Report, ReportDocument } from './report.schema';

@Injectable()
export class ReportService {
    constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

    async create(report: Report): Promise<Report> {
        return (new this.reportModel(report)).save();
    }
    
    async findOne(reportFilterQuery: FilterQuery<ReportDocument>): Promise<Report> {
        return this.reportModel.findOne(reportFilterQuery).exec();
    }

    async findSome(reportFilterQuery: FilterQuery<ReportDocument>): Promise<Report[]> {
        return this.reportModel.find(reportFilterQuery).sort({ post_time: -1 }).exec();
    }

    async findAll(): Promise<Report[]> {
        return this.reportModel.find().sort({ post_time: -1 }).exec();
    }
    
    async updateOne(reportFilterQuery: FilterQuery<ReportDocument>, report: Partial<Report>): Promise<Report> {
        return this.reportModel.findOneAndUpdate(reportFilterQuery, report, { new: true }).exec();
    }
    
    async deleteOne(reportFilterQuery: FilterQuery<ReportDocument>): Promise<Report> {
        return this.reportModel.findOneAndDelete(reportFilterQuery).exec();
    }
}
