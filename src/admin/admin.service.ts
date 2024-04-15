import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { IContext } from '../models/IContext';
import { Telegraf } from 'telegraf';
import { CreateProductDto } from './dto/create-product';
import { InputMediaPhoto } from 'telegraf/typings/core/types/typegram';
import { ProductDatabase } from '../database/database.product';

@Injectable()
export class AdminService {
   constructor(
      @InjectBot() private readonly bot: Telegraf<IContext>,
      private readonly productDatabase: ProductDatabase
   ) {}


   async createProduct(product: CreateProductDto, photos: Express.Multer.File[]) {
      const { title, category, price, description, contact } = product;

      try {
         const productId = await this.productDatabase.addProduct('6642364137');
         const reviewsLink = `${process.env.REVIEWS_URL}?startapp=${productId}`;
         const media: InputMediaPhoto[] = photos.map((photo, i) => ({
            type: 'photo',
            media: { source: photo.buffer, filename: `photo_${i}.png` },
            ...(i === 0 && {
               caption: `<b>${title}</b>\n\n<b>Категорія:</b> <i>#${category}</i>\n\n<b>Ціна:</b> <i>${price} UAH</i>\n\n<i>${description}</i>\n\n<b>Контакти:</b> <i>${contact}</i>\n\n<a href="${reviewsLink}">👉Переглянути відгуки👈</a>`,
               parse_mode: 'HTML'
            })
         }));
         await this.bot.telegram.sendMediaGroup(process.env.PRODUCT_GROUP_ID, media);
         return true;
      } catch (err) {
         console.log(err);
         return false;
      }
   }
}
