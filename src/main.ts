import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://dc-frontend-next.vercel.app'],
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true, 
    whitelist: true,
  }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
