import { Body, Controller, Get, Param, Post, Delete, Req, Res } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { refreshTokens, addRefreshToken, deleteRefreshToken } from 'src/refreshTokens';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  async Register(@Body() { username, password, email }: User, @Res() res: Response) {
      try {
        const existUser = await this.userService.findOne({ username });
        if (existUser)
          return res.status(400).json({ message: '用戶名已被使用!' });

        const existEmail = await this.userService.findOne({ email });
        if (existEmail)
          return res.status(400).json({ message: 'Email已被使用!' });
          
        const hashedPassword = await hash(password, 10);
        const result = await this.userService.create({
          username,
          password: hashedPassword,
          email,
          photoUrl: `http://${process.env.BASE_URL}:8000/avatar/1627857508344-black-cat-icon-6.jpg`,
          refreshToken: null,
          verified: false,
        });
        await this.mailService.sendEmailVerification({ 
          username: result.username, 
          email: result.email,
        }, { id: result['_id'] });
        
        return res.status(200).json({ result });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: '錯誤' });
      }
  }

  @Post('login')
  async Login(@Body() { email, password }: User, @Res() res: Response) {
    try {
      const existUser = await this.userService.findOne({ email });
      if (!existUser) return res.status(400).json({ message: '用戶不存在' });
      
      console.log('Logging in', existUser.username);

      const isCorrect = await compare(password, existUser.password);
      if (!isCorrect) return res.status(400).json({ message: '密碼錯誤' });
      
      const accessToken = await this.jwtService.signAsync(
        { username: existUser.username }, 
        { 
          secret: process.env.ACCESS_TOKEN_SECRET, 
          expiresIn: '30m' 
        },
      );
      const refreshToken = await this.jwtService.signAsync(
        { username: existUser.username }, 
        { secret: process.env.REFRESH_TOKEN_SECRET },
      );

      const hashedRefreshToken = await hash(refreshToken, 10);

      const result = await this.userService.updateOne({ _id: existUser['_id'] }, { refreshToken: hashedRefreshToken });

      return res.status(200).json({ result, accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: '錯誤' });
    }
  }

  @Delete(':userid')
  async Logout(@Param() { userid }, @Res() res: Response) {
    await this.userService.updateOne({ _id: userid }, { refreshToken: null });
    return res.sendStatus(200);
  }

  @Post('refreshtoken')
  async RefreshToken(@Body() { accessToken, refreshToken }, @Res() res: Response) {
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token is null!' });

    const allUsers = await this.userService.findAll();
    const existUser = (await Promise.all(allUsers.map(async user => {
      if (!user.refreshToken) return null;
      return (await compare(refreshToken, user.refreshToken)) ? user : null;
    }))).find(user => user);
    if (!existUser) return res.status(400).json({ message: 'Refresh token not available!' });
    
    try {
      const user = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });
      if (!user) return res.status(400).json({ message: 'Refresh token forbidden!' })

      const newAccessToken = await this.jwtService.signAsync(
        { username: existUser.username }, 
        { 
          secret: process.env.ACCESS_TOKEN_SECRET, 
          expiresIn: '1h',
        },
      );
      const newRefreshToken = await this.jwtService.signAsync(
        { username: existUser.username }, 
        { secret: process.env.REFRESH_TOKEN_SECRET },
      );

      const hashedRefreshToken = await hash(newRefreshToken, 10);

      const result = await this.userService.updateOne({ _id: existUser['_id'] }, { refreshToken: hashedRefreshToken });
      return res.status(200).json({ 
        result, 
        accessToken: newAccessToken, 
        refreshToken: newRefreshToken, 
        message: 'AccessToken refreshed!', 
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: '錯誤' });
    }
  }

  @Get('verified/:id')
  async verifyEmail(@Param() { id }, @Res() res: Response) {
    try {
      const existUser = await this.userService.findOne({ _id: id });
      if (!existUser) return res.status(400).json({ message: '用戶不存在' });

      await this.userService.updateOne({ _id: id }, { verified: true });
      return res.render('Verified');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: '錯誤' });
    }
  }
}
