import { Injectable } from '@nestjs/common';
import { getDatabase } from 'firebase-admin/database';

@Injectable()
export class ProductDatabase {
   constructor() {}

   private readonly db = getDatabase();

   async getProduct(productId: string) {
      const productSnapshot = await this.db.ref(`Products/${productId}`).once('value');
      return productSnapshot.val();
   }

   async getProductsByUser(userId: string) {
      const productsSnapshot = await this.db.ref('Products')
      .orderByChild('user').equalTo(userId).once('value');
      return productsSnapshot.val();
   }

   async addProduct(userId: string) {
      const productId = this.db.ref().child(`Products`).push().key;
      await this.db.ref(`Products/${productId}`).update({ user: userId });
      return productId;
   }

   async addMessageId(productId: string, messageId: number) {
      const updates = {};
      updates[`Products/${productId}/messageId`] = messageId;

      await this.db.ref().update(updates);
      return true;
   }
}
