import { Clue, ClueSchema } from './../clue/clue.schema';
import { ClueService } from './../clue/clue.service';
import { PointRecord, PointRecordSchema } from './../point-record/point-record.schema';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { MissionController } from './mission.controller';
import { Mission, MissionSchema } from './mission.schema';
import { MissionService } from './mission.service';
import { PointRecordService } from 'src/point-record/point-record.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mission.name, schema: MissionSchema },
      { name: PointRecord.name, schema: PointRecordSchema },
      { name: Clue.name, schema: ClueSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [
    MissionService,
    AuthService,
    PointRecordService,
    ClueService,
  ],
  controllers: [MissionController],
})
export class MissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('mission');
  };
}