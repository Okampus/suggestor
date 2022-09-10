import { Command } from '@discord-nestjs/core';
import messagesConfig from '../../configs/messages.config';
import { AddSubCommand } from './add.sub-command';
import { RemoveSubCommand } from './remove.sub-command';
import { SetSubCommand } from './set.sub-command';
import { ShowSubCommand } from './show.sub-command';

@Command({
  name: 'manage-points',
  description: messagesConfig.managePointsCommand.description,
  include: [
    AddSubCommand,
    RemoveSubCommand,
    SetSubCommand,
    ShowSubCommand,
  ],
})
export class ManagePointsCommand {}
