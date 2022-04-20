import { CouponModule } from './../coupon/coupon.module';
import { ProductModule } from './../product/product.module';
import { AdoptionRecordModule } from './../adoption-record/adoption-record.module';
import { ViolationReportModule } from './../violation-report/violation-report.module';
import { FeedbackModule } from './../feedback/feedback.module';
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
import { AppService } from './app.service';
import { Test, TestSchema } from './app.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, }),
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
    UserModule,
    AuthModule,
    FileModule,
    MissionModule,
    ClueModule,
    ReportModule,
    PutUpForAdoptionModule,
    PetModule,
    PointRecordModule,
    FeedbackModule,
    ViolationReportModule,
    AdoptionRecordModule,
    ProductModule,
    CouponModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
