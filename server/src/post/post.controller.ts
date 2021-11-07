import { Controller, Get, Res, Post, Body, Param, Delete } from '@nestjs/common';
import { Response } from 'express';
import { Post as PostModel } from 'src/post/post.schema';
import { PostService } from './post.service';
import * as moment from 'moment';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get('fetchall')
    async FetchAllPosts(@Res() res: Response) {
        const result = await this.postService.findAll();
        return res.status(200).json({ result });
    }

    @Get(':postid')
    async FetchPost(@Param() { postid }, @Res() res: Response) {
        const result = await this.postService.findOne({ _id: postid });
        return res.status(200).json({ result });
    }

    @Post('add')
    async AddPost(@Body() { userId, title, content, photoUrl, location }: PostModel, @Res() res: Response) {
        try {
            const result = await this.postService.create({
                userId,
                title,
                content,
                post_time: moment().valueOf(),
                photoUrl,
                location,
            })
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Delete(':postid')
    async DeletePost(@Param() { postid }, @Res() res: Response) {
        try {
            const result = await this.postService.findOne({ _id: postid });
            if (!result) return res.status(400).json({ message: '用戶不存在' });
    
            await this.postService.deleteOne({ _id: postid });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
