import { Injectable } from '@nestjs/common';
import { getDatabase } from 'firebase-admin/database';
import { subscriptionDate } from '../helpers/date';

@Injectable()
export class PaymentDatabase {
   constructor() {}

   private readonly db = getDatabase();
 
   async createSubscription(id: string, duration: number) {
      const data = await this.db.ref(`Users/${id}/subscription`).once('value');
      const subscription: number = data.val() || new Date().getTime();

      const { isSubscription, date } = subscriptionDate(subscription, duration);
      await this.db.ref(`Users/${id}`).update({ subscription: date });
      
      return isSubscription; 
   }
}
