import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserType } from 'src/DTOs/user.dto';
import { UserService } from 'src/services/user.service';
import { refreshTokens, addRefreshToken, deleteRefreshToken } from 'src/refreshTokens';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    @Get('fetchall')
    async FetchAllUsers(@Res() res) {
        const result = await this.userService.findAll();
        return res.status(200).json({ result });
    }

    @Post('delete')
    async DeleteUser(@Body() { username }: UserType, @Res() res) {
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
    async UpdateProfile(@Body() { photoUrl, username, newUsername, email, refreshToken }, @Res() res: Response) {
        try {
            console.log('Updating', photoUrl, username, newUsername, email);
            const existUser = await this.userService.findOne({ username });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });
    
            if (username !== newUsername) 
                if (await this.userService.findOne({ username: newUsername })) 
                    return res.status(400).json({ message: '用戶名已被使用!' });

            const result = await this.userService.updateOne({ username }, { 
                username: newUsername, 
                email,
                photoUrl,
            });

            deleteRefreshToken(refreshToken);
    
            const accessToken = await this.jwtService.signAsync(
                { username: result.username }, 
                { 
                    secret: process.env.ACCESS_TOKEN_SECRET, 
                    expiresIn: '30m',
                },
            );
            const newRefreshToken = await this.jwtService.signAsync(
                { username: result.username }, 
                { secret: process.env.REFRESH_TOKEN_SECRET },
            );

            addRefreshToken(newRefreshToken);
            
            return res.status(200).json({ result, accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
