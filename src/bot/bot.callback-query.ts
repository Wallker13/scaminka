import { Injectable } from '@nestjs/common';
import { PaymentDatabase } from '../database/database.payment';
import { IContext } from '../models/IContext';
import { deunionize } from 'telegraf';
import { getSubscriptionTerm } from '../helpers/subscription';
import rules from '../helpers/rules';

@Injectable()
export class CallbackQueryService {
   constructor(
      private readonly paymentDatabase: PaymentDatabase
   ) {}

   async onCallbackQuery(ctx: IContext) {
      const { data, message } = deunionize(ctx.callbackQuery);
      const { text, entities } = deunionize(message);
      const [action, type, ...rest] = data.split('&');

      if(action === 'confirm' && type === 'subscription') {
         const [id, duration] = rest;
         const status = 'Підтверджено';
         entities[entities.length - 1].length = status.length;
         try {
            const isSubscription = await this.paymentDatabase.createSubscription(id, +duration);
            if(isSubscription) {
               const term = getSubscriptionTerm(+duration);
               await ctx.telegram.sendMessage(id, `Оплата успішно підтвердженна!\nТремін вашої підписки продовжено на ${term}.`);
            } else {
               const { invite_link } = await ctx.telegram.createChatInviteLink(process.env.PROVIDER_CHANNEL_ID, { member_limit: 1 });
               await ctx.telegram.sendMessage(id, `Оплата успішно підтвердженна!\nВаше посилання для каналу з постачальниками - <i>${invite_link}</i>\n<b>Зверніть увагу!</b> Не передавайте дане посилання нікому, оскільки воно є одноразове.`, { parse_mode: 'HTML' });
            }
            await ctx.editMessageText(text.replace('Очікує перевірки', status), { entities });
         } catch(err) {
            console.log(err);
         }
      }
      if(action === 'confirm' && type === 'payment') {
         const [id] = rest;
         const status = 'Підтверджено';
         entities[entities.length - 1].length = status.length;
         const link = 'https://telegra.ph/KURS-YAk-kupuvati-rech%D1%96-z-Kitayu-ta-dostavlyati-ih-v-Ukrainu-03-16';
         try {
            await ctx.telegram.sendMessage(id, `Оплата успішно підтвердженна!\nПосилання на ваш курс - <i>${link}</i>`, {
               parse_mode: 'HTML'
            });
            await ctx.editMessageText(text.replace('Очікує перевірки', status), { entities });
         } catch(err) {
            console.log(err);
         }
      }
      if(action === 'reject') {
         const status = 'Відхилено';
         entities[entities.length - 1].length = status.length;
         try {
            await ctx.editMessageText(text.replace('Очікує перевірки', status), { entities });
         } catch(err) {
            console.log(err);
         }
      }
      if(action === 'rules') {
         try {
            await ctx.replyWithHTML(rules);
         } catch (err) {
            console.log(err)
         }
      }
   }
}
