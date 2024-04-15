import { Injectable } from '@nestjs/common';
import { IContext } from '../models/IContext';
import keyboard from './keyboard/bot.keyboard';
import buttons from './keyboard/bot.buttons';


@Injectable()
export class PaymentService {
   constructor() {}

   async confirmSubscription(ctx: IContext, phone: string) {
      const { tariff, duration, price } = ctx.session.subscription;
      const { from: { first_name }, chat: { id } } = ctx;

      try {
         await ctx.telegram.sendContact(process.env.ADMIN_GROUP_ID, phone, first_name, {
            message_thread_id: Number(process.env.PAYMENT_THREAD_ID)
         });
         await ctx.telegram.sendMessage(process.env.ADMIN_GROUP_ID, `<b>Оплата підписки</b>\n\nВибраний тариф: <i>${tariff}</i>\nСума до оплати: <i>${price} UAH</i>\nСтутус: <i>Очікує перевірки</i>`, { 
            reply_markup: {
               inline_keyboard: [
                  [{ text: buttons.payment.confirm, callback_data: `confirm&subscription&${id}&${duration}` }],
                  [{ text: buttons.payment.reject, callback_data: `reject&${id}` }]
               ]
            },
            parse_mode: 'HTML',
            message_thread_id: Number(process.env.PAYMENT_THREAD_ID)
         });
         await ctx.replyWithHTML(`Дякуємо! Незабаром з вами зв'яжеться адміністратор для підтвердження оплати.`, keyboard.menu);
      } catch(err) {
         console.log(err);
      }
   }

   async confirmPayment(ctx: IContext, phone: string) {
      const { course, price } = ctx.session.payment;
      const { from: { first_name }, chat: { id } } = ctx;

      try {
         await ctx.telegram.sendContact(process.env.ADMIN_GROUP_ID, phone, first_name, {
            message_thread_id: Number(process.env.PAYMENT_THREAD_ID)
         });
         await ctx.telegram.sendMessage(process.env.ADMIN_GROUP_ID, `<b>Оплата курсу</b>\n\nВибраний курс: <i>${course}</i>\nСума до оплати: <i>${price} UAH</i>\nСтутус: <i>Очікує перевірки</i>`, { 
            reply_markup: {
               inline_keyboard: [
                  [{ text: buttons.payment.confirm, callback_data: `confirm&payment&${id}` }],
                  [{ text: buttons.payment.reject, callback_data: `reject&${id}` }]
               ]
            },
            parse_mode: 'HTML',
            message_thread_id: Number(process.env.PAYMENT_THREAD_ID)
         });
         await ctx.replyWithHTML(`Дякуємо! Незабаром з вами зв'яжеться адміністратор для підтвердження оплати.`, keyboard.menu);
      } catch(err) {
         console.log(err);
      }
   }
}
