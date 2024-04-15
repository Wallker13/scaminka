import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product';
import { AdminService } from './admin.service';
import { CategoryDatabase } from '../database/database.category';
import { CreateCategoryDto, SelectCardDto } from './dto/create-category';
import { CardDatabase } from '../database/database.card';
import { AddCardDto } from './dto/add-card';

@Controller('admin')
export class AdminController {
   constructor(
      private readonly adminService: AdminService,
      private readonly categoryDatabase: CategoryDatabase,
      private readonly cardDatabase: CardDatabase,
   ) {}

   @Get('category/get-all')
   async getAllСategories() {
      return await this.categoryDatabase.getAllCategories();
   }

   @Post('category/create')
   async createСategory(@Body() createCategoryDto: CreateCategoryDto) {
      const { category } = createCategoryDto;
      const id = await this.categoryDatabase.createCategory(category);
      return { id };
   }

   @Delete('category/delete')
   async deleteСategory(@Query('id') id: string) {
      const status = await this.categoryDatabase.deleteCategory(id);
      return { status };
   }

   @Get('card/get-all')
   async getAllСards() {
      return await this.cardDatabase.getAllCards();
   }

   @Patch('card/select')
   async selectCard(@Body() celectCardDto: SelectCardDto) {
      const { id } = celectCardDto;
      return await this.cardDatabase.selectCard(id);
   }

   @Post('card/add')
   async addCard(@Body() createCategoryDto: AddCardDto) {
      const { card } = createCategoryDto;
      const id = await this.cardDatabase.addCard(card);
      return { id };
   }

   @Delete('card/delete')
   async deleteСard(@Query('id') id: string) {
      const status = await this.cardDatabase.deleteCard(id);
      return { status };
   }

   @Post('product/create')
   @UseInterceptors(FilesInterceptor('photo'))
   async createProduct(
      @Body() createProductDto: CreateProductDto,
      @UploadedFiles() photos: Express.Multer.File[]
   ) {
      const status = await this.adminService.createProduct(createProductDto, photos);
      return { status };
   }
}
