import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { Response } from 'express';
import { UserService } from 'src/services/user.service';
import { UserType } from 'src/DTOs/user.dto';
import { JwtService } from '@nestjs/jwt';
import { refreshTokens, addRefreshToken, deleteRefreshToken } from 'src/refreshTokens';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async Register(@Body() { username, password, email, photoUrl }: UserType, @Res() res: Response) {
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
          photoUrl: 'http://192.168.1.103:8000/avatar/1627857508344-black-cat-icon-6.jpg',
        });
        return res.status(200).json({ result });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: '錯誤' });
      }
  }

  @Post('login')
  async Login(@Body() { email, password }: UserType, @Res() res: Response) {
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

      addRefreshToken(refreshToken)
      console.log('User login, refreshTokens:', refreshTokens);
      return res.status(200).json({ result: existUser, accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: '錯誤' });
    }
  }

  @Post('logout')
  Logout(@Body() { refreshToken }, @Res() res: Response) {
    deleteRefreshToken(refreshToken)
    console.log('User logout, refreshTokens:', refreshTokens);
    return res.sendStatus(200);
  }

  @Post('refreshtoken')
  async RefreshToken(@Body() { accessToken, refreshToken }, @Res() res: Response) {
    if (!refreshToken) return res.status(200).json({ message: 'Refresh token is null!' });
    if (!refreshTokens.includes(refreshToken)) return res.status(200).json({ message: 'Refresh token is not in list!' });
    
    try {
      await this.jwtService.verifyAsync(accessToken, { secret: process.env.ACCESS_TOKEN_SECRET });

      return res.status(200).json({ message: 'AccessToken still available' });
    } catch (error) {
      try {
        const { username } = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });

        const existUser = await this.userService.findOne({ username });

        const newAccessToken = await this.jwtService.signAsync(
          { username: existUser.username }, 
          { 
            secret: process.env.ACCESS_TOKEN_SECRET, 
            expiresIn: '30m' 
          },
        );
        return res.status(200).json({ 
          result: existUser, 
          accessToken: newAccessToken, 
          refreshToken, 
          message: 'AccessToken refreshed!', 
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ message: '錯誤' });
      }
    }
  }
}
