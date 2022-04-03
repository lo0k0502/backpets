import { PointRecordModule } from './../point-record/point-record.module';
import { ClueModule } from './../clue/clue.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../image/image.module';
import { MissionModule } from '../mission/mission.module';
import { AppController } from './app.controller';
import { ReportModule } from '../report/report.module';
import { PutUpForAdoptionModule } from 'src/put-up-for-adoption/put-up-for-adoption.module';
import { PetModule } from 'src/pet/pet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, }),
    UserModule,
    AuthModule,
    FileModule,
    MissionModule,
    ClueModule,
    ReportModule,
    PutUpForAdoptionModule,
    PetModule,
    PointRecordModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
