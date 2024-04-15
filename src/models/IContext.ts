import { Context } from 'telegraf';

export interface IContext extends Context {
   session: {
      type: 'subscription' | 'payment';
      subscription: {
         tariff: string;
         duration: number;
         price: number;
      },
      payment: {
         course: string;
         price: number;
      }
   }
}