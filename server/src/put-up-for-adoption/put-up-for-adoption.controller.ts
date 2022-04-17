import { AdoptionRecordService } from './../adoption-record/adoption-record.service';
import { UserService } from './../user/user.service';
import { PetService } from './../pet/pet.service';
import { PutUpForAdoptionService } from './put-up-for-adoption.service';
import { Body, Controller, Get, Param, Post, Res, Delete } from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';
import * as moment from 'moment';

@Controller('put-up-for-adoption')
export class PutUpForAdoptionController {
    constructor(
        private readonly putUpForAdoptionService: PutUpForAdoptionService,
        private readonly petService: PetService,
        private readonly userService: UserService,
        private readonly adoptionRecordService: AdoptionRecordService,
    ) {}

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
    async AddPutUpForAdoption(@Body() { petId, content, county, district, phone }, @Res() res: Response) {
        try {
            const existPet = await this.petService.findOne({ _id: petId });
            const result = await this.putUpForAdoptionService.create({
                petId: new Types.ObjectId(petId),
                userId: existPet.userId,
                content,
                post_time: moment().valueOf(),
                county,
                district,
                phone,
                completed: false,
                adoptedUserId: null,
            });
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post('completeputupforadoption/:putupforadoptionid')
    async CompletePutUpForAdoption(@Param() { putupforadoptionid }, @Body() { adoptedUserId }, @Res() res: Response) {
        try {
            const existPutUpForAdoption = await this.putUpForAdoptionService.findOne({ _id: putupforadoptionid });
            if (!existPutUpForAdoption) return res.status(400).json({ message: '送養貼文不存在' });

            const existUser = await this.userService.findOne({ _id: adoptedUserId });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });

            if (existPutUpForAdoption.completed) return res.status(400).json({ message: '送養貼文已完成' });

            await this.putUpForAdoptionService.updateOne(
                { _id: putupforadoptionid },
                {
                    completed: true,
                    adoptedUserId: new Types.ObjectId(adoptedUserId),
                },
            );

            await this.petService.updateOne(
                { _id: existPutUpForAdoption.petId },
                { userId: new Types.ObjectId(adoptedUserId) },
            );

            await this.adoptionRecordService.create({
                putUpForAdoptionId: new Types.ObjectId(putupforadoptionid),
                userId: new Types.ObjectId(adoptedUserId),
                petId: existPutUpForAdoption.petId,
                time: moment().valueOf(),
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post(':putupforadoptionid')
    async EditPutUpForAdoption(@Param() { putupforadoptionid }, @Body() { content, county, district, phone }, @Res() res: Response) {
        try {
            const result = await this.putUpForAdoptionService.findOne({ _id: putupforadoptionid });
            if (!result) return res.status(400).json({ message: '送養貼文不存在' });
    
            await this.putUpForAdoptionService.updateOne({ _id: putupforadoptionid }, { content, county, district, phone });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Delete(':putupforadoptionid')
    async DeletePutUpForAdoption(@Param() { putupforadoptionid }, @Res() res: Response) {
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
