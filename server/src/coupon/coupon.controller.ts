import { ProductService } from './../product/product.service';
import { UserService } from 'src/user/user.service';
import { CouponService } from './coupon.service';
import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as moment from 'moment';

@Controller('coupon')
export class CouponController {
    constructor(
        private readonly couponService: CouponService,
        private readonly userService: UserService,
        private readonly productService: ProductService,
    ) {}

    @Get('fetchbyuserid/:userid')
    async FetchCouponsByUserId(@Param() { userid }, @Res() res: Response) {
        const coupons = await this.couponService.findSome({ userId: new Types.ObjectId(userid) });

        const result = await Promise.all(coupons.map(async coupon => {
            const product = await this.productService.findOne({ _id: coupon.productId });
            
            return {
                _id: coupon._id,
                userId: coupon.userId,
                productId: coupon.productId,
                due_time: coupon.due_time,
                exchanged: coupon.exchanged,
                product,
            };
        }));

        return res.status(200).json({ result });
    }

    @Post('generatecoupon')
    async GenerateCoupon(@Body() { userId, productId }, @Res() res: Response) {
        try {
            const existUser = await this.userService.findOne({ _id: userId });
            if (!existUser) return res.status(400).json({ message: '用戶不存在' });

            const existProduct = await this.productService.findOne({ _id: productId });
            if (!existProduct) return res.status(400).json({ message: '產品不存在' });

            await this.couponService.create({
                _id: null,
                userId: new Types.ObjectId(userId),
                productId: new Types.ObjectId(productId),
                due_time: moment().add(1, 'months').valueOf(),
                exchanged: false,
            });

            await this.productService.updateOne({ _id: productId }, { remaining_quantity: existProduct.remaining_quantity.valueOf() - 1 })

            const result = await this.userService.updateOne({ _id: userId }, { points: existUser.points.valueOf() - existProduct.points.valueOf() });

            return res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }

    @Post('complete/:couponid')
    async CompleteExchange(@Param() { couponid }, @Req() req: Request, @Res() res: Response) {
        const accessToken = req.headers.authorization?.split(' ')[1];

        if (accessToken !== process.env.EXCHANGE_ACCESS_TOKEN) return res.render('NotFound');
        return res.status(200).json({ message: couponid });
    }
}
