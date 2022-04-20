import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthService } from 'src/auth/auth.service';
import { ProductService } from './../product/product.service';
import { UserService } from 'src/user/user.service';
import { Product, ProductSchema } from './../product/product.schema';
import { Coupon, CouponSchema } from './coupon.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [
    CouponService,
    UserService,
    ProductService,
    AuthService,
  ],
  controllers: [CouponController]
})
export class CouponModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
          { path: 'coupon', method: RequestMethod.POST },
          { path: 'coupon', method: RequestMethod.DELETE },
      );
  };
}