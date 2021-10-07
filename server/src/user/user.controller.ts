import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserType } from './user.dto';
import { UserService } from './user.service';
import { refreshTokens, addRefreshToken, deleteRefreshToken } from 'src/refreshTokens';
import { hash, compare } from 'bcrypt';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    @Get('fetchall')
    async FetchAllUsers(@Res() res: Response) {
        const result = await this.userService.findAll();
        return res.status(200).json({ result });
    }

    @Get('fetchbyid/:id')
    async FetchUserById(@Param() { id }, @Res() res: Response) {
        const existUser = await this.userService.findOne({ _id: id });
        if (!existUser) return res.status(400).json({ message: '用戶不存在' });
        return res.status(200).json({ result: existUser });
    }

    @Post('delete')
    async DeleteUser(@Body() { username }: UserType, @Res() res: Response) {
        try {
            const existUser = await this.userService.findOne({ username });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });
    
            await this.userService.deleteOne({ username });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    } 

    @Post('updateprofile')
    async UpdateProfile(@Body() { userId, photoUrl, newUsername, email }, @Res() res: Response) {
        try {
            console.log('Updating: ', userId, photoUrl, newUsername, email);
            const existUser = await this.userService.findOne({ _id: userId });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });
    
            if (existUser.username !== newUsername && await this.userService.findOne({ username: newUsername })) 
                return res.status(400).json({ message: '用戶名已被使用!' });
    
            const accessToken = await this.jwtService.signAsync(
                { username: newUsername }, 
                { 
                    secret: process.env.ACCESS_TOKEN_SECRET, 
                    expiresIn: '30m',
                },
            );
            const newRefreshToken = await this.jwtService.signAsync(
                { username: newUsername }, 
                { secret: process.env.REFRESH_TOKEN_SECRET },
            );

            const hashedRefreshToken = await hash(newRefreshToken, 10);
            const result = await this.userService.updateOne({ _id: userId }, { 
                username: newUsername, 
                email,
                photoUrl,
                refreshToken: hashedRefreshToken,
            });
            
            return res.status(200).json({ result, accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post('updatepassword')
    async UpdatePassword(@Body() { userId, password, newPassword }, @Res() res: Response) {
        try {
            const existUser = await this.userService.findOne({ _id: userId });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });
            
            const isCorrect = await compare(password, existUser.password);
            if (!isCorrect) return res.status(400).json({ message: '密碼錯誤' });
    
            const hashedPassword = await hash(newPassword, 10);
            const result = await this.userService.updateOne({ _id: userId }, { password: hashedPassword });
            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
