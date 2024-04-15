import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { json, urlencoded } from 'express';

(async () => {
  const PORT = process.env.PORT || 8000;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})();
