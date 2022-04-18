import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('notfound')
    NotFound(@Res() res: Response) {
        return res.render('NotFound');
    }

    @Get('all')
    async GetAll(@Res() res: Response) {
        const result = await this.appService.findAll();
        return res.status(200).json({ result })
    }

    @Post('test')
    async Test(@Res() res: Response) {
        const result = await this.appService.create({
            _id: null,
            someThing: 'someThing',
        });

        return res.status(200).json({ result });
    }
}
