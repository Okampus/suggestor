import { On, Payload, UseGuards } from '@discord-nestjs/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import messagesConfig from '../../configs/messages.config';
import { ParseModal } from '../../lib/decorators';
import { GuildConfig } from '../../lib/entities/guild-config.entity';
import { CacheKey, DurationMs } from '../../lib/enums';
import {
  ButtonInteractionGuard,
  CanManageMessagesGuard,
  InteractionInGuildGuard,
  IsFeedbackButtonGuard,
  IsFeedbackModalGuard,
  MessageFromUserGuard,
  MessageInGuildGuard,
  ModalInteractionGuard,
} from '../../lib/guards';
import type { FeedbackState } from '../../lib/types';
import { GuildButtonInteraction, GuildMessage, GuildModalInteraction } from '../../lib/types';
import { Constants } from '../../lib/utils';
import { ActionResultDto } from './dto/action-result.dto';
import * as modals from './feedback-modal.components';
import { FeedbackService } from './feedback.service';

@Injectable()
export class FeedbackGateway {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(GuildConfig) private readonly configRepository: EntityRepository<GuildConfig>,
    private readonly feedbackService: FeedbackService,
  ) {}

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard, MessageInGuildGuard)
  public async onMessage(message: GuildMessage): Promise<void> {
    // Search through cached channels
    const cachedChannelIds = await this.cacheManager.get<Set<string>>(CacheKey.FeedbackChannelIds) ?? new Set();
    if (cachedChannelIds.has(message.channel.id))
      return this.feedbackService.create(message);

    // Retrieve the configuration set for the guild
    const config = await this.configRepository.findOne({ guildId: message.guild.id });
    if (!config)
      return;

    // Cache the found channels
    cachedChannelIds.addAll(...config.feedbackChannelIds);
    await this.cacheManager.set(CacheKey.FeedbackChannelIds, cachedChannelIds, DurationMs.OneWeek);

    // Check with the fetched guild configuration
    if (config.feedbackChannelIds.includes(message.channel.id))
      return this.feedbackService.create(message);
  }

  @On('interactionCreate')
  @UseGuards(ButtonInteractionGuard, InteractionInGuildGuard, CanManageMessagesGuard, IsFeedbackButtonGuard)
  public async onButton(interaction: GuildButtonInteraction): Promise<void> {
    // When a button is clicked, extract the feedback id and type from the custom id
    const { type, id: feedbackId } = Constants.FeedbackButtonCustomIdRegex
      .exec(interaction.customId)!.groups!;

    // Fetch the corresponding feedback
    const feedback = await this.feedbackService.findOne(feedbackId);
    if (!feedback)
      return;

    // Show a modal according to the button state
    if (this.isFeedbackState(type))
      await interaction.showModal(await modals[type](interaction, feedback));
  }

  @On('interactionCreate')
  @ParseModal()
  @UseGuards(ModalInteractionGuard, InteractionInGuildGuard, CanManageMessagesGuard, IsFeedbackModalGuard)
  public async onModal(
    @Payload() actionResultDto: ActionResultDto,
    interaction: GuildModalInteraction,
  ): Promise<void> {
    // When a modal is submitted, extract the feedback id and type from the custom id
    const { type, id: feedbackId } = Constants.FeedbackModalCustomIdRegex
      .exec(interaction.customId)!.groups!;

    // Fetch the corresponding feedback
    const feedback = await this.feedbackService.findOne(feedbackId);
    if (!feedback)
      return;

    // Compute the points to give to the user, if any
    const points = Number.isNaN(Number(actionResultDto.points)) ? 0 : Number(actionResultDto.points);
    const total = await this.feedbackService.addPoints(feedback.guildId, feedback.authorId, points);
    const payload = {
      reason: actionResultDto.reason,
      points,
      total,
    };

    // Do an action according to the submitted state
    if (this.isFeedbackState(type)) {
      await this.feedbackService[type](interaction, payload);
      await interaction.reply({ content: messagesConfig.feedback.replies[type], ephemeral: true });
    }
  }

  private isFeedbackState(param: string): param is FeedbackState {
    return ['reject', 'update', 'accept', 'drop', 'implement'].includes(param);
  }
}
