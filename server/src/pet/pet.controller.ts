import { Controller, Get, Param, Res, Post, Body, Delete } from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';
import { PetService } from './pet.service';

@Controller('pet')
export class PetController {
    constructor(private readonly petService: PetService) {}

    @Get('fetchall')
    async FetchAllPets(@Res() res: Response) {
        const result = await this.petService.findAll();
        return res.status(200).json({ result });
    }

    @Get('fetchbyuserid/:userid')
    async FetchByUserId(@Param() { userid }, @Res() res: Response) {
        const result = await this.petService.findSome({ userId: new Types.ObjectId(userid) });
        return res.status(200).json({ result });
    }

    @Get(':petid')
    async FetchPet(@Param() { petid }, @Res() res: Response) {
        const result = await this.petService.findOne({ _id: petid });
        return res.status(200).json({ result });
    }

    @Post('add')
    async AddPet(@Body() { name, userId, tag, breed, feature, gender, photoId, ligated, age, microchip }, @Res() res: Response) {
        try {
            const result = await this.petService.create({
                name,
                userId: new Types.ObjectId(userId),
                tag,
                breed,
                feature,
                gender,
                photoId: new Types.ObjectId(photoId),
                ligated,
                age,
                microchip,
            });
            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Delete(':petid')
    async DeletePet(@Param() { petid }, @Res() res: Response) {
        try {
            const result = await this.petService.findOne({ _id: petid });
            if (!result) return res.status(400).json({ message: '寵物不存在' });
    
            await this.petService.deleteOne({ _id: petid });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
