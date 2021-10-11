import { Controller, Get, Res, Post, Body, Param, Delete } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
    constructor() {}

    @Get('notfound')
    NotFound(@Res() res: Response) {
        return res.render('NotFound');
    }
}
