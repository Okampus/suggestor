import { Channel, Param } from '@discord-nestjs/core';
import { ChannelType } from 'discord.js';
import messagesConfig from '../../../configs/messages.config';

export class ChannelsDto {
  @Channel([ChannelType.GuildText])
  @Param({ required: true, description: messagesConfig.channelsCommand.params.channel })
  channel1: string;

  @Channel([ChannelType.GuildText])
  @Param({ required: false, description: messagesConfig.channelsCommand.params.channel })
  channel2?: string;

  @Channel([ChannelType.GuildText])
  @Param({ required: false, description: messagesConfig.channelsCommand.params.channel })
  channel3?: string;

  @Channel([ChannelType.GuildText])
  @Param({ required: false, description: messagesConfig.channelsCommand.params.channel })
  channel4?: string;

  @Channel([ChannelType.GuildText])
  @Param({ required: false, description: messagesConfig.channelsCommand.params.channel })
  channel5?: string;
}
