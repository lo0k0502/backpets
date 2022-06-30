import { Types } from 'mongoose';
import { ViolationReportService } from './violation-report.service';
import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';

@Controller('violation-report')
export class ViolationReportController {
    constructor(private readonly violationReportService: ViolationReportService) {}

    @Get('fetchall')
    async FetchAllViolationReports(@Res() res: Response) {
        const result = await this.violationReportService.findAll();
        return res.status(200).json({ result });
    }

    @Post('add')
    async AddViolationReport(@Body() { userId, post_type, postId, category, content }, @Res() res: Response) {
        try {
            const result = await this.violationReportService.create({
                _id: null,
                userId: new Types.ObjectId(userId),
                post_type,
                postId: new Types.ObjectId(postId),
                category,
                content,
                post_time: moment().valueOf(),
            });

            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Delete(':violationreportid')
    async DeleteViolationReport(@Param() { violationreportid }, @Res() res: Response) {
        try {
            const existViolationReport = await this.violationReportService.findOne({ _id: violationreportid });
            if (!existViolationReport) return res.status(400).json({ message: '檢舉不存在' });

            await this.violationReportService.deleteOne({ _id: violationreportid });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
