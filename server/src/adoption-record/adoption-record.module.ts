import { AuthMiddleware } from './../auth/auth.middleware';
import { AuthService } from './../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PutUpForAdoption, PutUpForAdoptionSchema } from './../put-up-for-adoption/put-up-for-adoption.schema';
import { PutUpForAdoptionService } from './../put-up-for-adoption/put-up-for-adoption.service';
import { AdoptionRecord, AdoptionRecordSchema } from './adoption-record.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AdoptionRecordController } from './adoption-record.controller';
import { AdoptionRecordService } from './adoption-record.service';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdoptionRecord.name, schema: AdoptionRecordSchema },
      { name: PutUpForAdoption.name, schema: PutUpForAdoptionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [
    AdoptionRecordService,
    PutUpForAdoptionService,
    UserService,
    AuthService,
  ],
  controllers: [AdoptionRecordController],
})
export class AdoptionRecordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('adoption-record');
  };
}
