import { Channel, Param } from '@discord-nestjs/core';
import { ChannelTypes } from 'discord.js/typings/enums';
import messagesConfig from '../../../../configs/messages.config';

export class ChannelsDto {
  @Channel([ChannelTypes.GUILD_TEXT])
  @Param({ required: true, description: messagesConfig.channelsCommand.params.channel })
  channel1: string;

  @Channel([ChannelTypes.GUILD_TEXT])
  @Param({ required: false, description: messagesConfig.channelsCommand.params.channel })
  channel2?: string;

  @Channel([ChannelTypes.GUILD_TEXT])
  @Param({ required: false, description: messagesConfig.channelsCommand.params.channel })
  channel3?: string;

  @Channel([ChannelTypes.GUILD_TEXT])
  @Param({ required: false, description: messagesConfig.channelsCommand.params.channel })
  channel4?: string;

  @Channel([ChannelTypes.GUILD_TEXT])
  @Param({ required: false, description: messagesConfig.channelsCommand.params.channel })
  channel5?: string;
}
