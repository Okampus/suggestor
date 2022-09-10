import { DiscordModule } from '@discord-nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Feedback } from '../../lib/entities/feedback.entity';
import { IssuesCommand } from './issues.command';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MikroOrmModule.forFeature([Feedback]),
  ],
  providers: [
    IssuesCommand,
  ],
  exports: [],
})
export class IssuesModule {}
