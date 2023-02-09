import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ 
    origin: ['https://kpd-makarov.nomoredomainsclub.ru', 'http://kpd-makarov.nomoredomainsclub.ru'],
  });
  await app.listen(3000);
}
bootstrap();
