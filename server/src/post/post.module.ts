import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from 'src/post/post.controller';
import { Post, PostSchema } from 'src/post/post.schema';
import { PostService } from './post.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}