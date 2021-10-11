import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/user.schema';

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

    async sendResetPasswordEmail({ username, email }: Partial<User>, { id }) {
      const url = `http://${process.env.BASE_URL}:8000/auth/resetpassword/${id}`;

      console.log(await this.mailerService.sendMail({
        to: email,
        subject: 'Password reset request',
        template: './resetPassword',
        context: {
          username,
          url,
        },
      }));
    }
};
