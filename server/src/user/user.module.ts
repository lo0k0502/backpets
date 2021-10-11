import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "src/user/user.controller";
import { AuthMiddleware } from "src/auth/auth.middleware";
import { User, UserSchema } from "src/user/user.schema";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({}),
    ],
    controllers: [UserController],
    providers: [UserResolver, UserService],
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