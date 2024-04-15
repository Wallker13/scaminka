import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AddReviewsDto } from './dto/add-reviews';
import { ReviewsDatabase } from '../database/database.reviews';
import { ReviewsService } from './reviews.service';
import { AddComplaintDto } from './dto/add-complaint';

@Controller('reviews')
export class ReviewsController {
   constructor(
      private readonly reviewsService: ReviewsService,
      private readonly reviewsDatabase: ReviewsDatabase
   ) {}

   @Get('get-all')
   async getAllReviews(@Query('id') id: string) {
      const reviews = await this.reviewsDatabase.getAllReviews(id);
      return reviews;
   }

   @Post('add')
   async addReviews(@Body() addReviewsDto: AddReviewsDto) {
      const { id, userId, name, raiting, review } = addReviewsDto;
      const data = await this.reviewsDatabase.addReview(id, userId, name, raiting, review);
      return data;
   }

   @Post('add-complaint')
   async addComplaint(@Body() addComplaintDto: AddComplaintDto) {
      const { complaint, userId, messageId } = addComplaintDto;
      const status = await this.reviewsService.addComplaint(complaint, userId, messageId);
      return { status };
   }
}
