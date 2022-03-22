import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthService } from 'src/auth/auth.service';
import { ReportController } from './report.controller';
import { Report, ReportSchema } from './report.schema';
import { ReportService } from './report.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    JwtModule.register({}),
  ],
  controllers: [ReportController],
  providers: [ReportService, AuthService],
})
export class ReportModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('clue');
  };
}
