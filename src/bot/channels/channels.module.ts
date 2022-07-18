import { DiscordModule } from '@discord-nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GuildConfig } from '../../lib/entities/guild-config.entity';
import * as guards from '../../lib/guards';
import { AddSubCommand } from './add.sub-command';
import { ChannelsCommand } from './channels.command';
import { RemoveSubCommand } from './remove.sub-command';
import { ShowSubCommand } from './show.sub-command';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MikroOrmModule.forFeature([GuildConfig]),
  ],
  providers: [
    guards.IsAdministratorGuard,

    ChannelsCommand,
    AddSubCommand,
    ShowSubCommand,
    RemoveSubCommand,
  ],
  exports: [],
})
export class ChannelsModule {}
