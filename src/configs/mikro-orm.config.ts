import type { Options } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Logger } from '@nestjs/common';
import config from './app.config';

const ormLogger = new Logger('MikroORM');

export default {
  type: 'mongo',

  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],

  allowGlobalContext: true,
  debug: config.nodeEnv === 'development',

  logger: ormLogger.log.bind(ormLogger),
  highlighter: new MongoHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
} as Options;
