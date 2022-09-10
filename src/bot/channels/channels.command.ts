import { Command } from '@discord-nestjs/core';
import { PermissionFlagsBits } from 'discord.js';
import messagesConfig from '../../configs/messages.config';
import { AddSubCommand } from './add.sub-command';
import { RemoveSubCommand } from './remove.sub-command';
import { ShowSubCommand } from './show.sub-command';

@Command({
  name: 'channels',
  description: messagesConfig.channelsCommand.description,
  defaultMemberPermissions: PermissionFlagsBits.Administrator,
  dmPermission: false,
  include: [
    AddSubCommand,
    ShowSubCommand,
    RemoveSubCommand,
  ],
})
export class ChannelsCommand {}
