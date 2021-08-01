import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "src/controllers/user/user.controller";
import { User, UserSchema } from "src/models/user.schema";
import { UserResolver } from "src/resolvers/user.resolver";
import { UserService } from "src/services/user.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({}),
    ],
    controllers: [UserController],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UserModule {}