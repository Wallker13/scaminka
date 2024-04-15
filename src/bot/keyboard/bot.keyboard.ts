import { Markup } from 'telegraf';
import buttons from './bot.buttons';

const menu = Markup.keyboard([
   [buttons.menu.discountedProducts],
   [buttons.menu.placeProduct],
   [buttons.menu.providerBase],
   [buttons.menu.buyCourses],
   [buttons.menu.myProfile],
   [buttons.menu.feedback]
]).resize(true);

const discountedProducts = Markup.inlineKeyboard([
   { 
      text: buttons.discountedProducts.rules,
      callback_data: 'rules'
   }
])

const tariffs = Markup.keyboard([
   [buttons.tariffs.oneMonth],
   [buttons.tariffs.twoMonths],
   [buttons.tariffs.sixMonths],
   [buttons.tariffs.becomeProvider],
   [buttons.tariffs.back]
]).resize(true);

const courses = Markup.keyboard([
   [buttons.courses.course1],
   // [buttons.courses.course2],
   [buttons.courses.back],
]).resize(true);

const confirmationWithPhone = Markup.keyboard([
   [Markup.button.contactRequest(
      buttons.confirmation.confirmPayment
   )],
   [buttons.confirmation.cancel]
]).resize();

const confirmationWithoutPhone = Markup.keyboard([
   [buttons.confirmation.confirmPayment],
   [buttons.confirmation.cancel]
]).resize();

export default { 
   menu, 
   discountedProducts,
   tariffs, 
   courses,
   confirmationWithPhone,
   confirmationWithoutPhone
};
