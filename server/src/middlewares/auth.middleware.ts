import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        console.log('AccessToken verifying...');
        
        const accessToken = req.headers.authorization.split(' ')[1];
        if (!accessToken) return res.status(400).json({ message: 'No access token!' });
        
        try {
            const user = await this.jwtService.verifyAsync(accessToken, { secret: process.env.ACCESS_TOKEN_SECRET });
            req.user = user;
            console.log('AccessToken verified!')
            next();

        } catch (error) {
            return res.status(400).json({ message: 'Forbidden!' });
        }
    }
}