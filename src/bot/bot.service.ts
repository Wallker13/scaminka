import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { IContext } from '../models/IContext';
import { Telegraf } from 'telegraf';

interface ITarrifData {
   duration: number;
   price: number;
}

interface ICourseData {
   price: number;
}

@Injectable()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf<IContext>) {}

   getTariffData(tariff: string): ITarrifData | null {
      const matches = tariff.match(/(\d+) місяц/i);
      if (!matches?.[1]) return;

      const duration = parseInt(matches[1]);
      const price = parseInt(tariff.match(/(\d+) UAH/)[1]);
      return { duration, price };
   }

   getCourseData(tariff: string): ICourseData {
      const price = parseInt(tariff.match(/(\d+) UAH/)[1]);
      return { price };
   }
}
