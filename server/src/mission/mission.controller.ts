import { ClueService } from './../clue/clue.service';
import { PointRecordService } from './../point-record/point-record.service';
import { Types } from 'mongoose';
import { Controller, Get, Res, Post, Body, Param, Delete } from '@nestjs/common';
import { Response } from 'express';
import { Mission } from 'src/mission/mission.schema';
import { MissionService } from './mission.service';
import * as moment from 'moment';

@Controller('mission')
export class MissionController {
    constructor(
        private readonly missionService: MissionService,
        private readonly pointRecordService: PointRecordService,
        private readonly clueService: ClueService,
    ) {}

    @Get('fetchall')
    async FetchAllMissions(@Res() res: Response) {
        const result = await this.missionService.findAll();
        return res.status(200).json({ result });
    }

    @Get('fetchbypetid/:petid')
    async FetchByPetId(@Param() { petid }, @Res() res: Response) {
        const result = await this.missionService.findSome({ petId: new Types.ObjectId(petid) });
        return res.status(200).json({ result });
    }

    @Get(':missionid')
    async FetchMission(@Param() { missionid }, @Res() res: Response) {
        const result = await this.missionService.findOne({ _id: missionid });
        return res.status(200).json({ result });
    }

    @Post('add')
    async AddMission(@Body() { petId, content, lost_time, location }, @Res() res: Response) {
        try {
            const result = await this.missionService.create({
                petId: new Types.ObjectId(petId),
                content,
                lost_time,
                post_time: moment().valueOf(),
                location,
                completed: false,
                chosen_clueIds: [],
            });
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post('completemission')
    async CompleteMission(@Body() { missionId, userId, chosen_clueIds }, @Res() res: Response) {
        try {
            const result = await this.missionService.findOne({ _id: missionId });
            if (!result) return res.status(400).json({ message: '任務不存在' });

            await this.missionService.updateOne({ _id: missionId }, { completed: true, chosen_clueIds });

            const now = moment().valueOf();

            const createPointRecord = async (clueId) => {
                await this.pointRecordService.create({
                    missionId: new Types.ObjectId(missionId),
                    userId: new Types.ObjectId(userId),
                    clueId: new Types.ObjectId(clueId),
                    time: now,
                });

                await this.clueService.updateOne({ _id: clueId }, { awarded: true });
            };

            await Promise.all(chosen_clueIds.map(clueId => createPointRecord(clueId)));

            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post(':missionid')
    async EditMission(@Param() { missionid }, @Body() { content, lost_time, location }, @Res() res: Response) {
        try {
            const result = await this.missionService.findOne({ _id: missionid });
            if (!result) return res.status(400).json({ message: '任務不存在' });

            await this.missionService.updateOne({ _id: missionid }, { content, lost_time, location });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Delete(':missionid')
    async DeleteMission(@Param() { missionid }, @Res() res: Response) {
        try {
            const result = await this.missionService.findOne({ _id: missionid });
            if (!result) return res.status(400).json({ message: '任務不存在' });
    
            await this.missionService.deleteOne({ _id: missionid });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
