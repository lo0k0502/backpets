import { Body, Controller, Get, Param, Post, Delete, Req, Res } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.schema';
import { MailService } from '../mail/mail.service';
import randomString from '../utils/randomString';
import { AuthService } from './auth.service';
import { addResetTokenUser, deleteResetTokenUser, resetTokenUsers } from 'src/refreshTokens';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
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
          photoUrl: `http://${process.env.BASE_URL}:8000/image/1627857508344-black-cat-icon-6.jpg`,
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
      
      const accessToken = await this.authService.signAccessTokenAsync(existUser);
      const { refreshToken, refreshTokenSignature } = await this.authService.signRefreshTokenAsync(existUser);

      const hashedRefreshTokenSignature = await hash(refreshTokenSignature, 10);

      const result = await this.userService.updateOne({ _id: existUser['_id'] }, { refreshToken: hashedRefreshTokenSignature });

      return res.status(200).json({ result, accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: '錯誤' });
    }
  }

  @Delete(':userid')
  async Logout(@Param() { userid }, @Res() res: Response) {
    await this.userService.updateOne({ _id: userid }, { refreshToken: null });
    return res.status(200).json({ message: 'success' });
  }

  @Post('refreshtoken')
  async RefreshToken(@Body() { refreshToken }: User, @Res() res: Response) {
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token is null!' });

    try {
      const user = await this.authService.verifyRefreshTokenAsync(refreshToken);
      if (!user) return res.status(400).json({ message: 'Refresh token forbidden!' });

      const refreshTokenSignature = refreshToken.split('.')[2];

      const existUser = await this.userService.findOne({ username: user.username, email: user.email });

      if (!existUser) return res.status(400).json({ message: '用戶不存在' });
      if (!existUser.refreshToken || !(await compare(refreshTokenSignature, existUser.refreshToken))) return res.status(400).json({ message: 'Refresh token not available!' });

      const newAccessToken = await this.authService.signAccessTokenAsync(existUser);
      const { refreshToken: newRefreshToken, refreshTokenSignature: newRefreshTokenSignature, } = await this.authService.signRefreshTokenAsync(existUser);

      const hashedRefreshTokenSignature = await hash(newRefreshTokenSignature, 10);

      const result = await this.userService.updateOne({ _id: existUser['_id'] }, { refreshToken: hashedRefreshTokenSignature });

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

  @Post('resetpassword')
  async ResetPassword(@Body() { email }, @Req() req: Request, @Res() res: Response) {
    const existUser = await this.userService.findOne({ email });
    if (!existUser) return res.status(400).json({ message: '用戶不存在' });

    try {
      const resetToken = await this.authService.signAccessTokenAsync(existUser, '5m');

      await this.mailService.sendResetPasswordEmail({
        username: existUser.username, 
        email: existUser.email,
      }, { resetToken });
      
      const hashedResetToken = await hash(resetToken, 15);

      addResetTokenUser({
        username: existUser.username,
        email: existUser.email,
        resetToken: hashedResetToken,
      });
      return res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: '錯誤' });
    }
  }

  @Get('resetpassword/:token')
  async ResetPasswordPage(@Param() { token }, @Res() res: Response) {
    try {
      if (!token) return res.redirect('/notfound');
      const resetTokenUser = resetTokenUsers.find(async user => await compare(token, user.resetToken));
      if (!resetTokenUser) return res.redirect('/notfound');
      
      await this.authService.verifyAccessTokenAsync(token);

      const existUser = await this.userService.findOne({ username: resetTokenUser.username, email: resetTokenUser.email });
      if (!existUser) return res.redirect('/notfound');

      deleteResetTokenUser(resetTokenUser);

      const newPassword = randomString(10, true, true, true);
      const hashedPassword = await hash(newPassword, 10);
      await this.userService.updateOne({ _id: existUser }, { password: hashedPassword });
      return res.render('ResetPassword', { newPassword: newPassword });
    } catch (error) {
      console.log(error);
      return res.redirect('/notfound');
    }
  }


  @Get('verified/:id')
  async VerifyEmail(@Param() { id }, @Res() res: Response) {
    try {
      const existUser = await this.userService.findOne({ _id: id });
      if (!existUser) return res.redirect('/notfound');

      await this.userService.updateOne({ _id: id }, { verified: true });
      return res.render('Verified');
    } catch (error) {
      console.log(error);
      return res.redirect('/notfound');
    }
  }
}
