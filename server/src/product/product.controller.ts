import { ProductService } from './product.service';
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('fetchall')
    async FetchAllProducts(@Res() res: Response) {
        const result = await this.productService.findAll();
        return res.status(200).json({ result });
    }

    @Get(':productid')
    async FetchProductById(@Param() { productid }, @Res() res: Response) {
        const result = await this.productService.findOne({ _id: productid });
        return res.status(200).json({ result });
    }

    @Post('add')
    async AddProduct(@Body() { productName, description, companyName, companyTelephone, companyAddress, photoId, price, points, remainingQuantity }, @Res() res: Response) {
        try {
            await this.productService.create({
                _id: null,
                product_name: productName,
                description,
                company_name: companyName,
                company_telephone: companyTelephone,
                company_address: companyAddress,
                photoId: new Types.ObjectId(photoId),
                price,
                points,
                remaining_quantity: remainingQuantity,
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: '錯誤' });
        }
    }
}
