import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../controllers/app/app.controller';
import { AppService } from '../services/app.service';
import { UserModule } from './user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { FileModule } from './file.module';
import { PostModule } from './post.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, }),
    UserModule,
    AuthModule,
    FileModule,
    PostModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
