import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CategoryDatabase } from '../database/database.category';
import { CardDatabase } from '../database/database.card';
import { ProductDatabase } from '../database/database.product';

@Module({
    providers: [
        AdminService,
        CategoryDatabase,
        CardDatabase,
        ProductDatabase
    ],
    controllers: [AdminController]
})
export class AdminModule {}
