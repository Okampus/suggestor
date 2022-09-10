import {
  Channel,
  Choice,
  Param,
  ParamType,
} from '@discord-nestjs/core';
import { ChannelType } from 'discord.js';
import messagesConfig from '../../../configs/messages.config';
import { FeedbackStatus } from '../../../lib/enums';

export class FiltersDto {
  @Channel([ChannelType.GuildText])
  @Param({ description: messagesConfig.issuesCommand.params.channelDescription })
  channel?: string;

  @Param({ type: ParamType.STRING, description: messagesConfig.issuesCommand.params.statusDescription })
  @Choice({
    [messagesConfig.issuesCommand.params.statusChoices[FeedbackStatus.Accepted]]: FeedbackStatus.Accepted,
    [messagesConfig.issuesCommand.params.statusChoices[FeedbackStatus.Rejected]]: FeedbackStatus.Rejected,
    [messagesConfig.issuesCommand.params.statusChoices[FeedbackStatus.Pending]]: FeedbackStatus.Pending,
    [messagesConfig.issuesCommand.params.statusChoices[FeedbackStatus.Dropped]]: FeedbackStatus.Dropped,
    [messagesConfig.issuesCommand.params.statusChoices[FeedbackStatus.Implemented]]: FeedbackStatus.Implemented,
    [messagesConfig.issuesCommand.params.statusChoices.waiting]: 'waiting',
    [messagesConfig.issuesCommand.params.statusChoices.all]: 'all',
  })
  status?: FeedbackStatus | 'all' | 'waiting';
}
