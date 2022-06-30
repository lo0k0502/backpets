import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';
import { ReportService } from './report.service';
import * as moment from 'moment';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get('fetchall')
    async FetchAllReports(@Res() res: Response) {
        const result = await this.reportService.findAll();
        return res.status(200).json({ result });
    }

    @Get(':reportid')
    async FetchReport(@Param() { reportid }, @Res() res: Response) {
        const result = await this.reportService.findOne({ _id: reportid });
        return res.status(200).json({ result });
    }

    @Post('add')
    async AddReport(@Body() { userId, content, tag, photoId, location }, @Res() res: Response) {
        try {
            const result = await this.reportService.create({
                _id: null,
                userId: new Types.ObjectId(userId),
                content,
                tag,
                post_time: moment().valueOf(),
                photoId: photoId ? new Types.ObjectId(photoId) : null,
                location,
            });
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post(':reportid')
    async EditReport(@Param() { reportid }, @Body() { content, tag, photoId, location }, @Res() res: Response) {
        try {
            const result = await this.reportService.findOne({ _id: reportid });
            if (!result) return res.status(400).json({ message: '通報不存在' });
    
            await this.reportService.updateOne({ _id: reportid }, { content, tag, photoId, location });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Delete(':reportid')
    async DeleteReport(@Param() { reportid }, @Res() res: Response) {
        try {
            const result = await this.reportService.findOne({ _id: reportid });
            if (!result) return res.status(400).json({ message: '通報不存在' });
    
            await this.reportService.deleteOne({ _id: reportid });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
