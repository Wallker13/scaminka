import { Injectable } from '@nestjs/common';
import { getDatabase } from 'firebase-admin/database';
import { formatDate } from '../helpers/date';

@Injectable()
export class UserDatabase {
   constructor() {}

   private readonly db = getDatabase();

   async authUser(id: number): Promise<boolean> {
      const userSnapshot = await this.db.ref(`Users/${id}`).once('value');
      if(userSnapshot.exists()) return true;

      const createAt = Date.now();
      await this.db.ref(`Users/${id}`).update({ createAt });
      return false;
   }

   async getPhone(id: number): Promise<string> {
      const phoneSnapshot = await this.db.ref(`Users/${id}/phone`).once('value');
      return phoneSnapshot.val();
   }

   async addPhone(id: number, phone: string): Promise<boolean> {
      await this.db.ref(`Users/${id}`).update({ phone });
      return true;
   }

   async getSubscription(id: number) {
      const subscriptionSnapshot = await this.db.ref(`Users/${id}/subscription`).once('value');
      const subscription = subscriptionSnapshot.val(); 

      const now = Date.now();
      return subscription > now ? formatDate(subscription) : null;
   }

   async getAllUsers() {
      const usersSnapshot = await this.db.ref(`Users`).once('value');
      return usersSnapshot.val();
   }
}
