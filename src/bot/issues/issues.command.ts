import { TransformPipe } from '@discord-nestjs/common';
import type { DiscordTransformedCommand, TransformedCommandExecutionContext } from '@discord-nestjs/core';
import { Command, Payload, UsePipes } from '@discord-nestjs/core';
import type { FilterQuery } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import type { ChatInputCommandInteraction } from 'discord.js';
import { EmbedBuilder, messageLink, PermissionFlagsBits } from 'discord.js';
import pupa from 'pupa';
import messagesConfig from '../../configs/messages.config';
import { Feedback } from '../../lib/entities/feedback.entity';
import { FeedbackStatus } from '../../lib/enums';
import { PaginatedContentMessageEmbed } from '../../lib/utils';
import { FiltersDto } from './dto/filters.dto';

@UsePipes(TransformPipe)
@Command({
  name: 'issues',
  description: messagesConfig.issuesCommand.description,
  defaultMemberPermissions: PermissionFlagsBits.SendMessages,
  dmPermission: false,
})
export class IssuesCommand implements DiscordTransformedCommand<FiltersDto> {
  constructor(
    @InjectRepository(Feedback) private readonly feedbackRepository: EntityRepository<Feedback>,
  ) {}

  public async handler(
    @Payload() filtersDto: FiltersDto,
    { interaction }: TransformedCommandExecutionContext & { interaction: ChatInputCommandInteraction },
  ): Promise<void> {
    const query: FilterQuery<Feedback> = {};

    if (!filtersDto.status || filtersDto.status === 'waiting')
      query.status = { $in: [FeedbackStatus.Pending, FeedbackStatus.Accepted] };
    else if (filtersDto.status !== 'all')
      query.status = filtersDto.status;

    if (filtersDto.channel)
      query.channelId = filtersDto.channel;

    // Retrieve the user points
    const feedbacks = await this.feedbackRepository.find(query);

    if (feedbacks.length === 0) {
      await interaction.reply({ content: messagesConfig.issuesCommand.noFeedbackFound, ephemeral: true });
      return;
    }

    const title = pupa(messagesConfig.issuesCommand.embed.titles[filtersDto.status ?? 'waiting'], {
      channel: filtersDto.channel,
      count: feedbacks.length,
    });

    await new PaginatedContentMessageEmbed()
      .setTemplate(new EmbedBuilder().setTitle(title))
      .setItems(
        feedbacks.map(feedback => pupa(messagesConfig.issuesCommand.embed.listItem, {
          ...feedback,
          createdAt: Math.round(feedback.createdAt.getTime() / 1000),
          url: messageLink(feedback.channelId, feedback.messageId, feedback.guildId),
        })),
      )
      .setItemsPerPage(15)
      .make()
      .run(interaction);
  }
}
