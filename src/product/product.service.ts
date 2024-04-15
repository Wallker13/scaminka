import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { CreateProductDto, CreateProviderProductDto } from './dto/create-product';
import { InputMediaPhoto } from 'telegraf/typings/core/types/typegram';
import { IContext } from '../models/IContext';
import { ProductDatabase } from '../database/database.product';

@Injectable()
export class ProductService {
   constructor(
      @InjectBot() private readonly bot: Telegraf<IContext>,
      private readonly productDatabase: ProductDatabase
   ) { }

   async createProduct(product: CreateProductDto, photos: Express.Multer.File[]) {
      const { title, category, price, description, contact, link, userId } = product;
      
      try {
         const productId = await this.productDatabase.addProduct(userId);
         const reviewsLink = `${process.env.REVIEWS_URL}?startapp=${productId}`;
         const media: InputMediaPhoto[] = photos.map((photo, i) => ({
            type: 'photo',
            media: { source: photo.buffer, filename: `photo_${i}.png` },
            ...(i === 0 && {
               caption: `<b>${title}</b>\n\n<b>Категорія:</b> <i>#${category}</i>\n\n<b>Ціна:</b> <i>${price} UAH</i>\n\n<i>${description}</i>\n\n<b>Контакти:</b> <i>${contact}</i>\n\n<a href="${reviewsLink}">👉Переглянути відгуки👈</a>`,
               parse_mode: 'HTML'
            })
         }));
         await this.bot.telegram.sendMediaGroup(process.env.ADMIN_GROUP_ID, media, {
            message_thread_id: Number(process.env.PRODUCT_THREAD_ID)
         });
         if(link) {
            await this.bot.telegram.sendMessage(process.env.ADMIN_GROUP_ID, `<b>Посилання на магазин: </b> <i>${link}</i>`, {
               message_thread_id: Number(process.env.PRODUCT_THREAD_ID),
               parse_mode: 'HTML'
            });
         }
         return true;
      } catch (err) {
         console.log(err);
         return false;
      }
   }

   async createProviderProduct(product: CreateProviderProductDto, photos: Express.Multer.File[]) {
      const { title, category, price, description, contact } = product;
      try {
         const media: InputMediaPhoto[] = photos.map((photo, i) => ({
            type: 'photo',
            media: { source: photo.buffer, filename: `photo_${i}.png` },
            ...(i === 0 && {
               caption: `<b>${title}</b>\n\n<b>Категорія:</b> <i>#${category}</i>\n\n<b>Ціна:</b> <i>${price}</i>\n\n<i>${description}</i>\n\n<b>Контакти:</b> <i>${contact}</i>`,
               parse_mode: 'HTML'
            })
         }));
         await this.bot.telegram.sendMediaGroup(process.env.ADMIN_GROUP_ID, media, {
            reply_to_message_id: Number(process.env.PROVIDER_PRODUCT_THREAD_ID)
         });

         return true;
      } catch (err) {
         console.log(err);
         return false;
      }
   }
}