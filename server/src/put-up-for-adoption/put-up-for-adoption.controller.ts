import { PutUpForAdoptionService } from './put-up-for-adoption.service';
import { Body, Controller, Get, Param, Post, Res, Delete } from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';
import * as moment from 'moment';

@Controller('put-up-for-adoption')
export class PutUpForAdoptionController {
    constructor(private readonly putUpForAdoptionService: PutUpForAdoptionService) {}

    @Get('fetchall')
    async FetchAllPutUpForAdoptions(@Res() res: Response) {
        const result = await this.putUpForAdoptionService.findAll();
        return res.status(200).json({ result });
    }

    @Get('fetchbyuserid/:userid')
    async FetchByUserId(@Param() { userid }, @Res() res: Response) {
        const result = await this.putUpForAdoptionService.findSome({ userId: new Types.ObjectId(userid) });
        return res.status(200).json({ result });
    }

    @Get(':putupforadoptionid')
    async FetchPutUpForAdoption(@Param() { putupforadoptionid }, @Res() res: Response) {
        const result = await this.putUpForAdoptionService.findOne({ _id: putupforadoptionid });
        return res.status(200).json({ result });
    }

    @Post('add')
    async AddPutUpForAdoption(@Body() { petId, content, location }, @Res() res: Response) {
        try {
            const result = await this.putUpForAdoptionService.create({
                petId: new Types.ObjectId(petId),
                content,
                post_time: moment().valueOf(),
                location,
            });
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Delete(':putupforadoptionid')
    async DeleteMission(@Param() { putupforadoptionid }, @Res() res: Response) {
        try {
            const result = await this.putUpForAdoptionService.findOne({ _id: putupforadoptionid });
            if (!result) return res.status(400).json({ message: '送養貼文不存在' });
    
            await this.putUpForAdoptionService.deleteOne({ _id: putupforadoptionid });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
