import { DiscordModule } from '@discord-nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GuildConfig } from '../../lib/entities/guild-config.entity';
import { ChannelsCommand } from './channels.command';
import { SetSubCommand } from './set.sub-command';
import { ShowSubCommand } from './show.sub-command';
import { UnsetSubCommand } from './unset.sub-command';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MikroOrmModule.forFeature([GuildConfig]),
  ],
  providers: [
    ChannelsCommand,
    SetSubCommand,
    ShowSubCommand,
    UnsetSubCommand,
  ],
  exports: [],
})
export class ChannelsModule {}
