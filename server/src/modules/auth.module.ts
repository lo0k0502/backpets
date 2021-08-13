import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { MailModule } from './mail.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
