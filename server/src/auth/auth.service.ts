import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    async signAccessTokenAsync(user: User, expiresIn: string | number = '30m') {
        const accessToken = await this.jwtService.signAsync(
        { 
          username: user.username,
          email: user.email,
        }, 
        { 
          secret: process.env.ACCESS_TOKEN_SECRET, 
          expiresIn,
        },
      );

      return accessToken;
    }

    async signRefreshTokenAsync(user: User) {
        const refreshToken = await this.jwtService.signAsync(
        { 
          username: user.username,
          email: user.email,
        }, 
        { secret: process.env.REFRESH_TOKEN_SECRET },
      );

      return refreshToken;
    }

    async verifyAccessTokenAsync(accessToken: string) {
        const user = await this.jwtService.verifyAsync(accessToken, { secret: process.env.ACCESS_TOKEN_SECRET });
        return user;
    }

    async verifyRefreshTokenAsync(refreshToken: string) {
        const user = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });
        return user;
    }
};
