import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { Product, ProductSchema } from './product.schema';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    JwtModule.register({}),
  ],
  providers: [ProductService, AuthService],
  controllers: [ProductController],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
          // { path: 'product', method: RequestMethod.POST },
          { path: 'product', method: RequestMethod.DELETE },
      );
  };
}