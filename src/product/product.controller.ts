import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, CreateProviderProductDto } from './dto/create-product';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductDatabase } from '../database/database.product';

@Controller('product')
export class ProductController {
   constructor(
      private readonly productService: ProductService,
      private readonly productDatabase: ProductDatabase   
   ) { }

   @Get('get')
   async getSeller(@Query('productId') productId: string) {
      const product = await this.productDatabase.getProduct(productId);
      return { product };
   }


   @Post('create')
   @UseInterceptors(FilesInterceptor('photo'))
   async createProduct(
      @Body() createProductDto: CreateProductDto,
      @UploadedFiles() photos: Express.Multer.File[]
   ) {
      const status = await this.productService.createProduct(createProductDto, photos);
      return { status };
   }

   @Post('provider/create')
   @UseInterceptors(FilesInterceptor('photo'))
   async createProviderProduct(
      @Body() createProductDto: CreateProviderProductDto,
      @UploadedFiles() photos: Express.Multer.File[]
   ) {
      const status = await this.productService.createProviderProduct(createProductDto, photos);
      return { status };
   }
}