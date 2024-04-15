import { Module } from '@nestjs/common';
import { BotModule } from '../bot/bot.module';
import { DatabaseModule } from '../database/database.module';
import { UserDatabase } from '../database/database.user';
import { ProductModule } from '../product/product.module';
import { PaymentDatabase } from '../database/database.payment';
import { AdminModule } from '../admin/admin.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
   imports: [
      BotModule, 
      DatabaseModule, 
      ProductModule,
      AdminModule,
      ReviewsModule,
      ScheduleModule
   ],
   controllers: [],
   providers: [
      UserDatabase,
      PaymentDatabase
   ]
})

export class AppModule {}
