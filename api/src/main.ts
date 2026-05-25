import dns from 'node:dns';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  dns.setServers(['1.1.1.1', '8.8.8.8']);

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:4200',
  });

  const port = process.env['PORT'] || 3000;
  await app.listen(port);

  Logger.log(`API is running on http://localhost:${port}/api`);
}

bootstrap();