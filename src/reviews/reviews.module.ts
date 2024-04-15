import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsDatabase } from '../database/database.reviews';
import { ProductDatabase } from '../database/database.product';
import { ReviewsService } from './reviews.service';

@Module({
   controllers: [ReviewsController],
   providers: [
      ReviewsDatabase,
      ProductDatabase,
      ReviewsService
   ]
})
export class ReviewsModule { }
