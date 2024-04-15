import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { UserDatabase } from '../database/database.user';
import { checkSubscription } from '../helpers/date';
import { delay } from '../helpers/delay';
import { Context, Telegraf } from 'telegraf';


@Injectable()
export class ScheduleService {
   constructor(
      @InjectBot() private readonly bot: Telegraf<Context>, 
      private readonly userDatabase: UserDatabase,
   ) {}

   // @Cron(CronExpression.EVERY_5_SECONDS)
   @Cron(CronExpression.EVERY_DAY_AT_9AM, { timeZone: 'Europe/Kyiv' })
   async notification() {
      const users = await this.userDatabase.getAllUsers();
      try {
         for(let id in users) {
            const { subscription } = users[id];
            if(!subscription) continue;
            const type = checkSubscription(subscription);

            if(type === 'notification') await this.bot.telegram.sendMessage(id, `Термін вашої підписки на канал з постачальниками минає завтра!`);
            if(type === 'deletion') {
               await this.bot.telegram.banChatMember(process.env.PROVIDER_CHANNEL_ID, +id);
               await this.bot.telegram.unbanChatMember(process.env.PROVIDER_CHANNEL_ID, +id);
            }
            
            await delay(5000);
         }
      } catch(err) {
         console.log(err);
      }
   }
}
