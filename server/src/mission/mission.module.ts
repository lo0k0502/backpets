import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { MissionController } from './mission.controller';
import { Mission, MissionSchema } from './mission.schema';
import { MissionService } from './mission.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mission.name, schema: MissionSchema }]),
    JwtModule.register({}),
  ],
  controllers: [MissionController],
  providers: [MissionService, AuthService],
})
export class MissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('mission');
  };
}