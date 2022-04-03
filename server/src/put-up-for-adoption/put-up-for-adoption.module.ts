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
    ]),
    JwtModule.register({}),
  ],
  providers: [
    PutUpForAdoptionService,
    AuthService,
    PetService,
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
