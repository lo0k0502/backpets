import { AuthMiddleware } from './../auth/auth.middleware';
import { AuthService } from './../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { Feedback, FeedbackSchema } from './feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }]),
    JwtModule.register({}),
  ],
  providers: [FeedbackService, AuthService],
  controllers: [FeedbackController],
})
export class FeedbackModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'feedback/add', method: RequestMethod.POST });
  };
}
