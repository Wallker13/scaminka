import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductDatabase } from "../database/database.product";

@Module({
   providers: [
      ProductService,
      ProductDatabase 
   ],
   controllers: [ProductController]
})
export class ProductModule {}
