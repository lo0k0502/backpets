import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/models/user.schema';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendEmailVerification({ username, email }: Partial<User>) {
        const url = `https://picsum.photos/700`;
    
        console.log(await this.mailerService.sendMail({
          to: email,
          subject: 'Welcome to Project App! Confirm your Email',
          template: './confirmation',
          context: {
            name: username,
            url,
          },
        }));
    }
};
