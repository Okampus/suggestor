import { DiscordModule } from '@discord-nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserPoint } from '../../lib/entities/user-point.entity';
import { LeaderboardCommand } from './leaderboard.command';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MikroOrmModule.forFeature([UserPoint]),
  ],
  providers: [
    LeaderboardCommand,
  ],
  exports: [],
})
export class LeaderboardModule {}
