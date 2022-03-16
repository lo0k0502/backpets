import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';
import { Clue } from './clue.schema';
import { ClueService } from './clue.service';
import * as moment from 'moment';

@Controller('clue')
export class ClueController {
    constructor(private readonly clueService: ClueService) {}

    @Get(':clueid')
    async FetchClue(@Param() { clueid }, @Res() res: Response) {
        const result = await this.clueService.findOne({ _id: clueid });
        return res.status(200).json({ result });
    }

    @Get('fetchbymission/:missionid')
    async FetchCluesByMission(@Param() { missionid }, @Res() res: Response) {
        const result = await this.clueService.findSome({ missionId: new Types.ObjectId(missionid) });
        return res.status(200).json({ result });
    }
    
    @Post('add')
    async AddClue(@Body() { userId, missionId, content, photoId, location }, @Res() res: Response) {
        try {
            const result = await this.clueService.create({
                userId: new Types.ObjectId(userId),
                missionId: new Types.ObjectId(missionId),
                content,
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

    @Delete(':clueid')
    async DeleteClue(@Param() { clueid }, @Res() res: Response) {
        try {
            const result = await this.clueService.findOne({ _id: clueid });
            if (!result) return res.status(400).json({ message: '線索不存在' });
    
            await this.clueService.deleteOne({ _id: clueid });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
