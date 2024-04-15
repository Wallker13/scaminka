import { Injectable } from '@nestjs/common';
import { getDatabase } from 'firebase-admin/database';
import { nanoid } from 'nanoid';


@Injectable()
export class CategoryDatabase {
   constructor() {}

   private readonly db = getDatabase();

   async getAllCategories() {
      const categories = []; 
      await this.db.ref(`Сategories`)
      .orderByChild('timestamp')
      .once('value', snapshot => {
         snapshot.forEach(category => {
            const data = category.val();
            categories.push({ 
               id: category.key, 
               category: data.category
            });
         });
      });
      return categories;
   }
 
   async createCategory(category: string) {
      const id = nanoid()
      const timestamp = Date.now();

      await this.db.ref(`Сategories/${id}`).update({ category, timestamp });
      return id; 
   }

   async deleteCategory(id: string) {
      await this.db.ref(`Сategories/${id}`).remove();
      return true; 
   }
}
