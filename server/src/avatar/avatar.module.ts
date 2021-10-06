import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AvatarController } from 'src/avatar/avatar.controller';
import { GridFsMulterConfigService } from './avatar.middleware';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  controllers: [AvatarController],
  providers: [GridFsMulterConfigService],
})
export class FileModule {}