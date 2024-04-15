import { Injectable } from '@nestjs/common';
import { getDatabase } from 'firebase-admin/database';

@Injectable()
export class ReviewsDatabase {
   constructor() {}

   private readonly db = getDatabase();

   async getAllReviews(id: string) {
      let reviews = {};
      await this.db.ref(`Reviews/${id}`)
      .once('value', snapshot => {
         const list = []; 
         const res = snapshot.val();
         snapshot.child('list').forEach(review => {
            const data = review.val();
          
            list.push({ 
               id: review.key, 
               name: data.name,
               rating: data.rating,
               review: data.review
            });
         });
         reviews = { 
            rating: res?.rating || null, 
            amount: res?.amount || null, 
            list 
         };
      });
      return reviews;
   }

   async addReview(id: string, userId: string, name: string, rating: number, review: string) {
      const res = await this.db.ref(`Reviews/${id}`).once('value');
      const data = res.val() || { rating: 0, amount: 0, reviewers: {} };

      const isReviewer = Object.values(data.reviewers).includes(userId);
      if(isReviewer) return false;

      const listId = this.db.ref().child(`Reviews/${id}/list`).push().key;
      const reviewerId = this.db.ref().child(`Reviews/${id}/reviewers`).push().key;

      const updates = {};
      updates[`Reviews/${id}/rating`] = data.rating + rating;
      updates[`Reviews/${id}/amount`] = data.amount + 1;
      updates[`Reviews/${id}/list/${listId}`] = { name, rating, review };
      updates[`Reviews/${id}/reviewers/${reviewerId}`] = userId;
   
      await this.db.ref().update(updates);

      return { 
         rating: data.rating + rating,
         amount: data.amount + 1,
         single: { 
            id: listId,
            name,
            rating, 
            review 
         }
      }; 
   }
}
