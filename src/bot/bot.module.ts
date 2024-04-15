import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { CallbackQueryService } from './bot.callback-query';
import { PaymentService } from './bot.payment';
import { UserDatabase } from '../database/database.user';
import { PaymentDatabase } from '../database/database.payment';
import { session } from 'telegraf';
import { CardDatabase } from '../database/database.card';
import { ConfigModule } from '@nestjs/config';
import { ProductDatabase } from '../database/database.product';

@Module({
  imports: [      
   ConfigModule.forRoot({
      envFilePath: `.env`,
   }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      middlewares: [
         session()
      ],
      launchOptions: {
         dropPendingUpdates: true
      }
    })
  ],
   providers: [
      BotUpdate, 
      BotService, 
      CallbackQueryService,
      PaymentService,
      UserDatabase,
      PaymentDatabase,
      CardDatabase,
      ProductDatabase
   ]
})
export class BotModule {}
