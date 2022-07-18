import 'dotenv/config';
import 'core-js/proposals/collection-methods';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './configs/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, config.nodeEnv === 'development'
    ? { logger: ['debug'] }
    : {});

  app.enableShutdownHooks();
}

void bootstrap();
