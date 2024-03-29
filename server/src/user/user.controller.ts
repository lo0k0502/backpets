import { ClueService } from './../clue/clue.service';
import { MailService } from '../mail/mail.service';
import { Types } from 'mongoose';
import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { User } from './user.schema';
import { UserService } from './user.service';
import { hash, compare } from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        private readonly clueService: ClueService,
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

    @Post('updateprofile')
    async UpdateProfile(@Body() { userId, photoId, username, email }, @Res() res: Response) {
        try {
            console.log('Updating: ', userId, photoId, username, email);
            const existUser = await this.userService.findOne({ _id: userId });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });
    
            if (existUser.username !== username && await this.userService.findOne({ username })) 
                return res.status(400).json({ message: '帳號名稱已被使用!' });

            const emailIsChanged = email !== existUser.email;

            const updatedOnceUser = await this.userService.updateOne({ _id: userId }, { 
                username, 
                email,
                photoId: new Types.ObjectId(photoId),
                verified: !emailIsChanged,
            });

            if (emailIsChanged) {
                await this.mailService.sendEmailVerification({ 
                    username: updatedOnceUser.username, 
                    email: updatedOnceUser.email,
                }, { id: updatedOnceUser['_id'] });
            }
    
            const accessToken = await this.authService.signAccessTokenAsync(updatedOnceUser);
            const { refreshToken: newRefreshToken, refreshTokenSignature } = await this.authService.signRefreshTokenAsync(updatedOnceUser);

            const hashedRefreshTokenSignature = await hash(refreshTokenSignature, 10);
            const result = await this.userService.updateOne({ _id: userId }, { refreshToken: hashedRefreshTokenSignature });
            
            return res.status(200).json({ result, accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post('updatepassword')
    async UpdatePassword(@Body() { email, password, newPassword }, @Res() res: Response) {
        try {
            const existUser = await this.userService.findOne({ email });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });
            
            const isCorrect = await compare(password, existUser.password);
            if (!isCorrect) return res.status(400).json({ message: '密碼錯誤' });
    
            const hashedPassword = await hash(newPassword, 10);
            const result = await this.userService.updateOne({ email }, { password: hashedPassword });
            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post('updatepoints')
    async UpdatePoints(@Body() { userId, clueId, points }, @Res() res: Response) {
        try {
            const existUser = await this.userService.findOne({ _id: userId });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });

            const result = await this.userService.updateOne({ _id: userId }, { points: existUser.points + points });
            await this.clueService.updateOne({ _id: clueId }, { pointsReceived: true });
            
            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post('updatesearchhistory')
    async UpdateSearchHistory(@Body() { userId, searchHistory }, @Res() res: Response) {
        try {
            const existUser = await this.userService.findOne({ _id: userId });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });

            let newSearchHistory = existUser.searchHistory;
            newSearchHistory = newSearchHistory.filter(history => history !== searchHistory);
            newSearchHistory.push(searchHistory);

            const result = await this.userService.updateOne({ _id: userId }, { searchHistory: newSearchHistory });

            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Delete(':userid')
    async DeleteUser(@Param() { userid }, @Res() res: Response) {
        try {
            const existUser = await this.userService.findOne({ _id: userid });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });
    
            await this.userService.deleteOne({ _id: userid });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: '錯誤' });
        }
    } 
}
