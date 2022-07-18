import { DiscordModule } from '@discord-nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserPoint } from '../../lib/entities/user-point.entity';
import { PointsCommand } from './points.command';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MikroOrmModule.forFeature([UserPoint]),
  ],
  providers: [
    PointsCommand,
  ],
  exports: [],
})
export class PointsModule {}
