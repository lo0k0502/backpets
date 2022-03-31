import { Clue, ClueSchema } from './../clue/clue.schema';
import { ClueModule } from './../clue/clue.module';
import { ClueService } from './../clue/clue.service';
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
        MongooseModule.forFeature([{ name: Clue.name, schema: ClueSchema }]),
        JwtModule.register({}),
        MailModule,
    ],
    controllers: [UserController],
    providers: [UserService, AuthService, ClueService],
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