import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ThreadAutoArchiveDuration } from 'discord.js';
import { Feedback } from '../../lib/entities/feedback.entity';
import { UserPoint } from '../../lib/entities/user-point.entity';
import { FeedbackStatus } from '../../lib/enums';
import type { GuildMessage, GuildModalInteraction } from '../../lib/types';
import { Constants as MyConstants, trimText } from '../../lib/utils';
import * as buttons from './feedback-button.components';
import * as embeds from './feedback-embed.components';

interface FeedbackModalResult<Optional extends boolean = false> {
  reason: Optional extends true ? string | undefined : string;
}

interface FeedbackModalResultWithPoints<Optional extends boolean = false> extends FeedbackModalResult<Optional> {
  points: number;
  total: number;
}

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private readonly feedbackRepository: EntityRepository<Feedback>,
    @InjectRepository(UserPoint) private readonly userPointRepository: EntityRepository<UserPoint>,
  ) {}

  public async create(message: GuildMessage): Promise<void> {
    const feedbackId = await this.feedbackRepository.count({ guildId: message.guild.id }) + 1;

    // 1. Create a thread
    await message.startThread({
      name: `[${feedbackId}] ${trimText(message.content, 40)}`,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    });

    // 2. Store the feedback in the database
    // (We do it first so then we have access to the ID of the inserted document for the custom component IDs)
    const feedback = new Feedback({
      guildId: message.guild.id,
      channelId: message.channel.id,
      messageId: message.id,
      authorId: message.author.id,
      feedbackId,
    });
    await this.feedbackRepository.persistAndFlush(feedback);

    // 3. Reply to the message with a status embed and the buttons
    const statusMessage = await message.reply({
      embeds: [embeds.getStatusEmbed(message, feedbackId)],
      components: buttons.getStatusEmbedComponents(feedback._id.toString()),
      allowedMentions: { repliedUser: false },
    });

    feedback.statusMessageId = statusMessage.id;
    await this.feedbackRepository.flush();
  }

  public async findOne(feedbackUid: string): Promise<Feedback | null> {
    return await this.feedbackRepository.findOne({ id: feedbackUid });
  }

  public async reject(interaction: GuildModalInteraction, result: FeedbackModalResultWithPoints): Promise<void> {
    await this.feedbackRepository.nativeUpdate(
      { statusMessageId: interaction.message.id },
      { status: FeedbackStatus.Rejected },
    );

    // We change the embed and remove all the buttons
    await interaction.message.edit({
      embeds: [embeds.getRejectEmbed(interaction, result)],
      components: [],
    });
  }

  public async update(interaction: GuildModalInteraction, result: FeedbackModalResult): Promise<void> {
    // We add a field the embed
    await interaction.message.edit({
      embeds: [embeds.getUpdateEmbed(interaction, result)],
    });
  }

  public async accept(interaction: GuildModalInteraction, result: FeedbackModalResult<true>): Promise<void> {
    await this.feedbackRepository.nativeUpdate(
      { statusMessageId: interaction.message.id },
      { status: FeedbackStatus.Accepted },
    );

    // We change the embed and put a new set of buttons
    const feedbackUid = MyConstants.FeedbackModalCustomIdRegex.exec(interaction.customId)!.groups!.id!;
    await interaction.message.edit({
      embeds: [embeds.getAcceptEmbed(interaction, result)],
      components: buttons.getAcceptedComponents(feedbackUid),
    });
  }

  public async drop(interaction: GuildModalInteraction, result: FeedbackModalResultWithPoints): Promise<void> {
    await this.feedbackRepository.nativeUpdate(
      { statusMessageId: interaction.message.id },
      { status: FeedbackStatus.Dropped },
    );

    // We change the embed and remove all the buttons
    await interaction.message.edit({
      embeds: [embeds.getDropEmbed(interaction, result)],
      components: [],
    });
  }

  public async implement(
    interaction: GuildModalInteraction,
    result: FeedbackModalResultWithPoints<true> & { link?: string },
  ): Promise<void> {
    await this.feedbackRepository.nativeUpdate(
      { statusMessageId: interaction.message.id },
      { status: FeedbackStatus.Implemented },
    );

    // We change the embed and remove all the buttons
    await interaction.message.edit({
      embeds: [embeds.getImplementEmbed(interaction, result)],
      components: [],
    });
  }

  public async addPoints(guildId: string, userId: string, points?: number): Promise<number> {
    // Try to find the user's points, or create a new document
    let userPoint = await this.userPointRepository.findOne({ guildId, userId });
    if (!userPoint) {
      userPoint = new UserPoint({ guildId, userId });
      await this.userPointRepository.persistAndFlush(userPoint);
    }

    if (!points)
      return userPoint.points;

    // Add the points to the user's points
    userPoint.points += points;
    await this.userPointRepository.flush();
    return userPoint.points;
  }
}
