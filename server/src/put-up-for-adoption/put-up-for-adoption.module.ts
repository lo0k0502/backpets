import { AdoptionRecordService } from './../adoption-record/adoption-record.service';
import { AdoptionRecord, AdoptionRecordSchema } from './../adoption-record/adoption-record.schema';
import { UserService } from './../user/user.service';
import { User, UserSchema } from './../user/user.schema';
import { Pet, PetSchema } from './../pet/pet.schema';
import { AuthMiddleware } from './../auth/auth.middleware';
import { PutUpForAdoption, PutUpForAdoptionSchema } from './put-up-for-adoption.schema';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PutUpForAdoptionService } from './put-up-for-adoption.service';
import { PutUpForAdoptionController } from './put-up-for-adoption.controller';
import { AuthService } from 'src/auth/auth.service';
import { PetService } from 'src/pet/pet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PutUpForAdoption.name, schema: PutUpForAdoptionSchema },
      { name: Pet.name, schema: PetSchema },
      { name: User.name, schema: UserSchema },
      { name: AdoptionRecord.name, schema: AdoptionRecordSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [
    PutUpForAdoptionService,
    AuthService,
    PetService,
    UserService,
    AdoptionRecordService,
  ],
  controllers: [PutUpForAdoptionController]
})
export class PutUpForAdoptionModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('put-up-for-adoption');
  };
}
