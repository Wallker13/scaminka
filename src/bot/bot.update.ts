import { Command, Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { deunionize } from 'telegraf';
import { IContext } from '../models/IContext';
import { BotService } from './bot.service';
import { CallbackQueryService } from './bot.callback-query';
import { PaymentService } from './bot.payment';
import { UserDatabase } from '../database/database.user';
import keyboard from './keyboard/bot.keyboard';
import buttons from './keyboard/bot.buttons';
import { encryptData } from '../helpers/encryption';
import { CardDatabase } from '../database/database.card';
import { ProductDatabase } from '../database/database.product';

@Update()
export class BotUpdate {
   constructor(
      private readonly botService: BotService,
      private readonly callbackQueryService: CallbackQueryService,
      private readonly paymentService: PaymentService,
      private readonly userDatabase: UserDatabase,
      private readonly cardDatabase: CardDatabase,
      private readonly productDatabase: ProductDatabase
   ) { }

   @Command('start')
   async onStart(@Ctx() ctx: IContext) {
      const isUser = await this.userDatabase.authUser(ctx.chat.id);
      try {
         if (isUser) {
            await ctx.replyWithHTML('Меню:', keyboard.menu);
         } else {
            await ctx.replyWithHTML(`Вас вітає команда <b>BASICS!</b>\n\nДаний бот допоможе знайти найкращі товари за найнижчими цінами, подати власні товари, отримати доступ до каналу з постачальниками та багато іншого.\n\nОзнайомтеся з усіма можливостями нижче👇`, keyboard.menu);
         }
      } catch (err) {
         console.log(err);
      }
   }

   @Command('restart')
   @Hears(buttons.tariffs.back)
   @Hears(buttons.courses.back)
   async onRestart(@Ctx() ctx: IContext) {
      try {
         await ctx.replyWithHTML('Меню:', keyboard.menu);
      } catch (err) {
         console.log(err);
      }
   }

   @Hears(buttons.menu.discountedProducts)
   async onDiscountedProducts(@Ctx() ctx: IContext) {
      try {
         const link = 'https://t.me/+yYXMLjH3f2VkYjEy';
         await ctx.replyWithHTML(`Приєднуйтесь до нашого каналу, де зібрані найкращі товари за найнижчими цінами.\n\nПосилання - <i>${link}</i>`, keyboard.discountedProducts);
      } catch (err) {
         console.log(err);
      }
   }

   @Hears(buttons.menu.placeProduct)
   async onPlaceProduct(@Ctx() ctx: IContext) {
      const data = { id: ctx.chat.id, username: ctx.from.username || '' };
      const params = encryptData(JSON.stringify(data));
      const url = `${process.env.WEB_APP_URL}/create-product/${params}`;
      try {
         await ctx.replyWithHTML('Щоб розмісити товар заповніть форму👇', {
            reply_markup: {
               inline_keyboard: [
                  [{ text: buttons.placeProduct.fillForm, url }]
               ]
            }
         });
      } catch (err) {
         console.log(err);
      }
   }

   @Hears(buttons.menu.providerBase)
   @Hears(buttons.confirmation.cancel)
   async onProviderBase(@Ctx() ctx: IContext) {
      try {
         await ctx.replyWithHTML('Оберіть тариф:', keyboard.tariffs);
      } catch (err) {
         console.log(err);
      }
   }

   @Hears(buttons.tariffs.oneMonth)
   @Hears(buttons.tariffs.twoMonths)
   @Hears(buttons.tariffs.sixMonths)
   async onTariffs(@Ctx() ctx: IContext) {
      const { text } = deunionize(ctx.message);
      if (!text) return;

      const [tariff, price] = text.split(' - ');
      const tariffData = this.botService.getTariffData(text);
      ctx.session.type = 'subscription';
      ctx.session.subscription = { tariff, ...tariffData };
      try {
         const phone = await this.userDatabase.getPhone(ctx.chat.id);
         const selectedKeyboard = !!phone ? keyboard.confirmationWithoutPhone : keyboard.confirmationWithPhone;
         const card = await this.cardDatabase.getActiveCard();
         await ctx.replyWithHTML(`<b>Вибраний тариф:</b> <i>${tariff}</i>\n<b>Сума до оплати:</b> <i>${price}</i>\n\nДля здійснення оплати переведіть вказану суму за реквізитами нижче👇<code>\n\n${card ? card : '4444333322221111'}</code>\n\n<b>Зверніть увагу!</b> Відправте суму, яка вказана вище. У цю суму комісії не входять, вони стягуються окремо банком. Якщо оплата пройшла успішно і з вашого рахунку списались кошти, обов'язково натисніть кнопку <i>«Підтвердити оплату ✅»</i>, після цього з вами зв'яжеться адміністратор для підтвердження.`, selectedKeyboard);
      } catch (err) {
         console.log(err);
      }
   }

   @Hears(buttons.tariffs.becomeProvider)
   async onBecomeProvider(@Ctx() ctx: IContext) {
      try {
         const data = { id: ctx.chat.id, username: ctx.from.username || '' };
         const params = encryptData(JSON.stringify(data));
         const url = `${process.env.WEB_APP_URL}/create-provider-product/${params}`;

         await ctx.replyWithHTML('Щоб стати постачальником, заповніть форму👇', {
            reply_markup: {
               inline_keyboard: [
                  [{ text: buttons.placeProduct.fillForm, url }]
               ]
            }
         });
      } catch (err) {
         console.log(err);
      }
   }

   @Hears(buttons.menu.buyCourses)
   @Hears(buttons.confirmation.cancel)
   async onBuyCourses(@Ctx() ctx: IContext) {
      try {
         await ctx.replyWithHTML('Курси📚, які допоможуть вам ефективно замовляти товари з Китаю оптовими партіями і успішно займатися дропшипінгом.\n\nОберіть курс:', keyboard.courses);
      } catch (err) {
         console.log(err);
      }
   }

   @Hears(buttons.courses.course1)
   @Hears(buttons.courses.course2)
   async onCourses(@Ctx() ctx: IContext) {
      const { text } = deunionize(ctx.message);
      if (!text) return;

      const [course, price] = text.split(' - ');
      const courseData = this.botService.getCourseData(text);

      ctx.session.type = 'payment';
      ctx.session.payment = { course, ...courseData };

      try {
         const phone = await this.userDatabase.getPhone(ctx.chat.id);
         const selectedKeyboard = !!phone ? keyboard.confirmationWithoutPhone : keyboard.confirmationWithPhone;
         const card = await this.cardDatabase.getActiveCard() || '4441114458666086';
         await ctx.replyWithHTML(`<b>Вибраний курс:</b> <i>${course}</i>\n<b>Сума до оплати:</b> <i>${price}</i>\n\nДля здійснення оплати переведіть вказану суму за реквізитами нижче👇<code>\n\n${card ? card : '4444333322221111'}</code>\n\n<b>Зверніть увагу!</b> Відправте суму, яка вказана вище. У цю суму комісії не входять, вони стягуються окремо банком. Якщо оплата пройшла успішно і з вашого рахунку списались кошти, обов'язково натисніть кнопку <i>«Підтвердити оплату ✅»</i>, після цього з вами зв'яжеться адміністратор для підтвердження.`, selectedKeyboard);
      } catch (err) {
         console.log(err);
      }
   }

   @On('contact')
   async onContact(@Ctx() ctx: IContext) {
      const type = ctx.session.type;

      try {
         if (!type) {
            await ctx.replyWithHTML('Час оплати вийшов! Спробуйте ще раз.', keyboard.tariffs);
         } else {
            const { contact: { phone_number } } = deunionize(ctx.message);
            await this.userDatabase.addPhone(ctx.chat.id, phone_number);

            if (type === 'subscription') await this.paymentService.confirmSubscription(ctx, phone_number);
            if (type === 'payment') await this.paymentService.confirmPayment(ctx, phone_number);
         }
      } catch (err) {
         console.log(err);
      }
   }

   @Hears(buttons.confirmation.confirmPayment)
   async onConfirmPayment(@Ctx() ctx: IContext) {
      const type = ctx.session.type;

      if (!type) {
         try {
            await ctx.replyWithHTML('Час оплати вийшов! Спробуйте ще раз.', keyboard.tariffs);
         } catch (err) {
            console.log(err)
         }
      } else {
         const phone = await this.userDatabase.getPhone(ctx.chat.id);

         if (type === 'subscription') await this.paymentService.confirmSubscription(ctx, phone);
         if (type === 'payment') await this.paymentService.confirmPayment(ctx, phone);
      }
   }

   @Hears(buttons.menu.myProfile)
   async onMyProfile(@Ctx() ctx: IContext) {
      const subscription = await this.userDatabase.getSubscription(ctx.chat.id);
      try {
         if (subscription) {
            await ctx.replyWithHTML(`<b>Підписка:</b> <i>Дійсна до ${subscription}</i>`);
         } else {
            await ctx.replyWithHTML(`<b>Підписка:</b> <i>Немає</i>`);
         }
      } catch (err) {
         console.log(err)
      }
   }

   @Hears(buttons.menu.feedback)
   async onFeedback(@Ctx() ctx: IContext) {
      try {
         await ctx.replyWithHTML(`Якщо у вас виникли питання чи пропозиції, звертайтеся до нас. Ми з радістю вам допоможемо.\n\n<b>Адмін:</b> <i>@basics_admin</i>`);
      } catch (err) {
         console.log(err)
      }
   }

   @On('callback_query')
   async onCallbackQuery(@Ctx() ctx: IContext) {
      const { data, message } = deunionize(ctx.callbackQuery);
      if (!data || !message) return;
      await this.callbackQueryService.onCallbackQuery(ctx);
   }

   @On('channel_post')
   async func(@Ctx() ctx: IContext) {
      if (ctx.chat.id === Number(process.env.PRODUCT_GROUP_ID)) {
         const { caption_entities } = deunionize(ctx.channelPost);
         const messageEntity = caption_entities?.filter(entity => entity.type === 'text_link');
         if (messageEntity?.length) {
            const { url } = deunionize(messageEntity[0]);
            const productId = url.split('=')[1];
            await this.productDatabase.addMessageId(productId, ctx.channelPost.message_id);
         }
      }
   }
}