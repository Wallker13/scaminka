import { Injectable } from '@nestjs/common';
import { ProductDatabase } from '../database/database.product';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { IContext } from '../models/IContext';

@Injectable()
export class ReviewsService {
   constructor(
      @InjectBot() private readonly bot: Telegraf<IContext>,
      private readonly productDatabase: ProductDatabase,
   ) { }

   async addComplaint(complaint: string, userId: string, messageId: string) {
      const products = await this.productDatabase.getProductsByUser(userId);
      const groupId = process.env.PRODUCT_GROUP_ID.slice(3);

      let productLinks = '';
      for(let id in products) {
         if(products[id].messageId === messageId) {
            productLinks += `<b>https://t.me/c/${groupId}/${products[id].messageId}</b>\n`;
         } else {
            productLinks += `https://t.me/c/${groupId}/${products[id].messageId}\n`;
         }
      }

      await this.bot.telegram.sendMessage(process.env.ADMIN_GROUP_ID, `<b>Скарга:</b>\n<i>${complaint}</i>\n\n<b>Товари продавця:</b>\n${productLinks}`, {
         message_thread_id: Number(process.env.COMPLAINTS_THREAD_ID),
         parse_mode: 'HTML'
      });
      return true;
   }
}
