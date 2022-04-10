import { FeedbackDocument } from './../feedback/feedback.schema';
import { ViolationReport } from './violation-report.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class ViolationReportService {
    constructor(@InjectModel(ViolationReport.name) private violationReportModel: Model<ViolationReport>) {}

    async create(violationReport: ViolationReport): Promise<ViolationReport> {
        return (new this.violationReportModel(violationReport)).save();
    }

    async findOne(violationReportFilterQuery: FilterQuery<FeedbackDocument>): Promise<ViolationReport> {
        return this.violationReportModel.findOne(violationReportFilterQuery).exec();
    }

    async findSome(violationReportFilterQuery: FilterQuery<FeedbackDocument>): Promise<ViolationReport[]> {
        return this.violationReportModel.find(violationReportFilterQuery).sort({ post_time: -1 }).exec();
    }

    async findAll(): Promise<ViolationReport[]> {
        return this.violationReportModel.find().sort({ post_time: -1 }).exec();
    }

    async deleteOne(violationReportFilterQuery: FilterQuery<FeedbackDocument>): Promise<ViolationReport> {
        return this.violationReportModel.findOneAndDelete(violationReportFilterQuery).exec();
    }
}
