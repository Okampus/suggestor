import { Command } from '@discord-nestjs/core';
import { PermissionFlagsBits } from 'discord.js';
import messagesConfig from '../../configs/messages.config';
import { SetSubCommand } from './set.sub-command';
import { ShowSubCommand } from './show.sub-command';
import { UnsetSubCommand } from './unset.sub-command';

@Command({
  name: 'channels',
  description: messagesConfig.channelsCommand.description,
  defaultMemberPermissions: PermissionFlagsBits.Administrator,
  dmPermission: false,
  include: [
    SetSubCommand,
    ShowSubCommand,
    UnsetSubCommand,
  ],
})
export class ChannelsCommand {}
