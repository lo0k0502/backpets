import { PointRecordService } from './point-record.service';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('point-record')
export class PointRecordController {
    constructor(private readonly pointRecordService: PointRecordService) {}

    @Get(':pointrecordid')
    async FetchPointRecord(@Param() { pointrecordid }, @Res() res: Response) {
        const result = await this.pointRecordService.findOne({ _id: pointrecordid });
        return res.status(200).json({ result });
    }
}
