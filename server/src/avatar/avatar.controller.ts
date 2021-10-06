import { Controller, Get, Post, Res, UploadedFile, UseInterceptors, Param, Delete } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { Connection } from 'mongoose';
import { MongoGridFS } from 'mongo-gridfs';

@Controller('avatar')
export class AvatarController {
    private gfs: MongoGridFS;
    constructor(@InjectConnection() private readonly connection: Connection) {
        this.gfs = new MongoGridFS(this.connection.db, 'avatar');
    }

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('avatar'))
    Upload(@UploadedFile() file, @Res() res: Response) {
        if (!file) return res.status(400).json({ message: 'No file selected' });
        if (file.mimetype !== 'image/jpeg'
            && file.mimetype !== 'image/png') 
            return res.status(400).json({ message: 'Not an image!!' });
        console.log(file)
        const imgUrl = `http://${process.env.BASE_URL}:8000/avatar/${file.filename}`;
    
        return res.status(200).json({ imgUrl });
    }

    @Get(':filename')
    async GetAvatar(@Param() { filename }, @Res() res: Response) {
        try {
            const avatar = (await this.gfs.find({ filename }))[0];
            const readStream = await this.gfs.readFileStream(avatar._id.toString());
            readStream.pipe(res);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Getting error' });
        }
    }

    @Delete(':filename')
    async DeleteAvatar(@Param() { filename }, @Res() res: Response) {
        try {
            const avatar = (await this.gfs.find({ filename }))[0];
            if (!avatar) return res.status(400).json({ message: 'No such file' });
            await this.gfs.delete(avatar._id.toString());
            return res.status(200).json({ message: 'Successfully deleted' });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Deleting error' });
        }
    }
}
