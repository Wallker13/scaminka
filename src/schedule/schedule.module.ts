import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleModule as Schedule } from '@nestjs/schedule';
import { UserDatabase } from '../database/database.user';

@Module({
   imports: [
      Schedule.forRoot()
   ],
   providers: [
      ScheduleService, 
      UserDatabase
   ]
})

export class ScheduleModule { }
