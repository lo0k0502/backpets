import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AvatarController } from 'src/controllers/avatar/avatar.controller';
import { GridFsMulterConfigService } from 'src/middlewares/img.middleware';

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