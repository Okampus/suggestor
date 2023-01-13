import { Channel, Param } from '@discord-nestjs/core';
import { ChannelType } from 'discord.js';
import messagesConfig from '../../../configs/messages.config';

export class ChannelDto {
  @Channel([ChannelType.GuildForum])
  @Param({ required: true, description: messagesConfig.channelsCommand.params.channel })
  channel: string;
}
