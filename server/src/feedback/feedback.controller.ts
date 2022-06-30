import { Types } from 'mongoose';
import { FeedbackService } from './feedback.service';
import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Get('fetchall')
    async FetchAllFeedbacks(@Res() res: Response) {
        const result = await this.feedbackService.findAll();
        return res.status(200).json({ result });
    }

    @Post('add')
    async AddFeedback(@Body() { userId, content }, @Res() res: Response) {
        try {
            const result = await this.feedbackService.create({
                _id: null,
                userId: new Types.ObjectId(userId),
                content,
                post_time: moment().valueOf(),
            });

            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
