import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { ClueController } from './clue.controller';
import { Clue, ClueSchema } from './clue.schema';
import { ClueService } from './clue.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Clue.name, schema: ClueSchema }]),
    ],
    controllers: [ClueController],
    providers: [ClueService],
})
export class ClueModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware)
        .forRoutes('clue');
    };
}
