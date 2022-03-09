import { MailModule } from './../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "src/user/user.controller";
import { AuthMiddleware } from "src/auth/auth.middleware";
import { User, UserSchema } from "src/user/user.schema";
import { UserService } from "./user.service";
import { AuthService } from "src/auth/auth.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({}),
        MailModule,
    ],
    controllers: [UserController],
    providers: [UserService, AuthService],
    exports: [UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware)
        .forRoutes(
            { path: 'user/updateprofile', method: RequestMethod.POST },
            { path: 'user/updatepassword', method: RequestMethod.POST },
            { path: 'user/fetchbyid', method: RequestMethod.GET },
        );
    };
}