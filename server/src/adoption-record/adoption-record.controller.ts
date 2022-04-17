import { UserService } from './../user/user.service';
import { PutUpForAdoptionService } from './../put-up-for-adoption/put-up-for-adoption.service';
import { AdoptionRecordService } from './adoption-record.service';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Types } from 'mongoose';
import { Response } from 'express';

@Controller('adoption-record')
export class AdoptionRecordController {
    constructor(
        private readonly adoptionRecordService: AdoptionRecordService,
        private readonly putUpForAdoptionService: PutUpForAdoptionService,
        private readonly userService: UserService,
    ) {}

    @Get('fetchbyuserid/:userid')
    async FetchAdoptionRecordsByUserId(@Param() { userid }, @Res() res: Response) {
        const result = await this.adoptionRecordService.findSome({ userId: new Types.ObjectId(userid) });
        return res.status(200).json({ result });
    }

    @Get('fetchbyputuserid/:putuserid')
    async FetchAdoptionRecordsByPutUserId(@Param() { putuserid }, @Res() res: Response) {
        try {
            const existUser = await this.userService.findOne({ _id: putuserid });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });

            const result = await this.putUpForAdoptionService.findSome({ userId: new Types.ObjectId(putuserid), completed: true });
            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
