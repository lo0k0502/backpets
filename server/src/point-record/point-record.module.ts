import { JwtModule } from '@nestjs/jwt';
import { PointRecord, PointRecordSchema } from './point-record.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './../auth/auth.service';
import { AuthMiddleware } from './../auth/auth.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PointRecordService } from './point-record.service';
import { PointRecordController } from './point-record.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PointRecord.name, schema: PointRecordSchema }]),
    JwtModule.register({}),
  ],
  providers: [PointRecordService, AuthService],
  controllers: [PointRecordController]
})
export class PointRecordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('point-record');
  };
}
