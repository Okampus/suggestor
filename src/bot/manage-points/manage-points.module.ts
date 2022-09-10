import { DiscordModule } from '@discord-nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserPoint } from '../../lib/entities/user-point.entity';
import { AddSubCommand } from './add.sub-command';
import { ManagePointsCommand } from './manage-points.command';
import { RemoveSubCommand } from './remove.sub-command';
import { SetSubCommand } from './set.sub-command';
import { ShowSubCommand } from './show.sub-command';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MikroOrmModule.forFeature([UserPoint]),
  ],
  providers: [
    ManagePointsCommand,
    AddSubCommand,
    RemoveSubCommand,
    SetSubCommand,
    ShowSubCommand,
  ],
  exports: [],
})
export class ManagePointsModule {}
