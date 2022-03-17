import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthService } from 'src/auth/auth.service';
import { ClueController } from './clue.controller';
import { Clue, ClueSchema } from './clue.schema';
import { ClueService } from './clue.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Clue.name, schema: ClueSchema }]),
        JwtModule.register({}),
    ],
    controllers: [ClueController],
    providers: [ClueService, AuthService],
    exports: [ClueService],
})
export class ClueModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware)
        .forRoutes('clue');
    };
}
