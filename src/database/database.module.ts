import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FirebaseModule } from "nestjs-firebase";

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: `.env`,
      }),
      FirebaseModule.forRoot({
         googleApplicationCredential: {
            clientEmail: process.env.CLIENT_EMAIL,
            privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
            projectId: process.env.PROJECT_ID,
         },
         databaseURL: process.env.DATABASE_URL,
      }),
   ],
})
export class DatabaseModule {}
