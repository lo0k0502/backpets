import { Module } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          secure: true,
          port: 465,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"ProjectP" <${process.env.MAIL_FROM}>`,
        },
        preview: true,
        template: {
          dir: join(__dirname, '../templates/mail'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    })
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
