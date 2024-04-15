import { Injectable } from '@nestjs/common';
import { getDatabase } from 'firebase-admin/database';
import { nanoid } from 'nanoid';


@Injectable()
export class CardDatabase {
   constructor() {}

   private readonly db = getDatabase();

   async getAllCards() {
      const cards = []; 
      await this.db.ref(`Cards`)
      .orderByChild('timestamp')
      .once('value', snapshot => {
         snapshot.forEach(card => {
            const data = card.val();
            cards.push({ 
               id: card.key, 
               card: data.card,
               isActive: data.isActive
            });
         });
      });
      return cards;
   }
 
   async selectCard (id: string) {
      const res = await this.db.ref('Cards')
      .orderByChild('isActive')
      .equalTo(true)
      .once('value');
      const [oldId] = Object.keys(res.val() || {});
      if(!!oldId) {
         await this.db.ref(`Cards/${oldId}`).update({ isActive: false });
      }
      await this.db.ref(`Cards/${id}`).update({ isActive: true });
      return true;
   }

   async addCard(card: string) {
      const id = nanoid();
      const timestamp = Date.now();

      await this.db.ref(`Cards/${id}`).update({ 
         card, 
         isActive: false,
         timestamp 
      });

      return id; 
   }

   async deleteCard(id: string) {
      await this.db.ref(`Cards/${id}`).remove();
      return true; 
   }

   async getActiveCard() {
      const res = await this.db.ref('Cards')
      .orderByChild('isActive')
      .equalTo(true)
      .limitToFirst(1)
      .once('value');

      let card = '';
      res.forEach(item => card = item.val().card);
      return card;
   }
}
