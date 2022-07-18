import { Command } from '@discord-nestjs/core';
import messagesConfig from '../../configs/messages.config';
import { AddSubCommand } from './add.sub-command';
import { RemoveSubCommand } from './remove.sub-command';
import { ShowSubCommand } from './show.sub-command';

@Command({
  name: 'channels',
  description: messagesConfig.channelsCommand.description,
  include: [
    AddSubCommand,
    ShowSubCommand,
    RemoveSubCommand,
  ],
})
export class ChannelsCommand {}
