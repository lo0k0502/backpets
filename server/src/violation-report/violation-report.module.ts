import { AuthMiddleware } from './../auth/auth.middleware';
import { AuthService } from './../auth/auth.service';
import { ViolationReport, ViolationReportSchema } from './violation-report.schema';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ViolationReportController } from './violation-report.controller';
import { ViolationReportService } from './violation-report.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ViolationReport.name, schema: ViolationReportSchema }]),
    JwtModule.register({}),
  ],
  providers: [ViolationReportService, AuthService],
  controllers: [ViolationReportController],
})
export class ViolationReportModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'violation-report/add', method: RequestMethod.POST },
        { path: 'violation-report', method: RequestMethod.DELETE },
      );
  };
}
