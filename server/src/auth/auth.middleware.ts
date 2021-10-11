import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        console.log(req.originalUrl, 'AccessToken verifying...');
        
        const accessToken = req.headers.authorization.split(' ')[1];
        if (!accessToken) return res.status(400).json({ message: 'No access token!' });
        
        try {
            await this.authService.verifyAccessTokenAsync(accessToken);
            console.log('AccessToken verified!');
            next();

        } catch (error) {
            console.log('AccessToken forbidden!');
            return res.status(400).json({ message: 'AccessToken forbidden!' });
        }
    }
}