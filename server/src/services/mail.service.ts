import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/models/user.schema';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendEmailVerification({ username, email }: Partial<User>, { id }) {
        const url = `http://${process.env.BASE_URL}:8000/auth/verified/${id}`;
    
        console.log(await this.mailerService.sendMail({
          to: email,
          subject: 'Welcome to Project App! Confirm your Email',
          template: './confirmation',
          context: {
            username,
            url,
          },
        }));
    }
};