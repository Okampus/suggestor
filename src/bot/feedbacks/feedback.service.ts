import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { GuildForumTag, PublicThreadChannel, TextBasedChannel } from 'discord.js';
import appConfig from '../../configs/app.config';
import { Feedback } from '../../lib/entities/feedback.entity';
import { UserPoint } from '../../lib/entities/user-point.entity';
import { FeedbackStatus } from '../../lib/enums';
import type { GuildMessage, GuildModalInteraction } from '../../lib/types';
import { isForumThreadChannel, Constants as MyConstants } from '../../lib/utils';
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
    const feedbackId = await this.feedbackRepository.count({ guildId: message.guildId }) + 1;

    // 1. Store the feedback in the database
    // (We do it first so then we have access to the ID of the inserted document for the custom component IDs)
    const feedback = new Feedback({
      guildId: message.guildId,
      channelId: message.channel.parentId!,
      threadId: message.channelId,
      messageId: message.id,
      authorId: message.author.id,
      feedbackId,
    });
    await this.feedbackRepository.persistAndFlush(feedback);

    // 2. Reply to the message with a status embed and the buttons
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
      { statusMessageId: interaction.message!.id },
      { status: FeedbackStatus.Rejected },
    );

    // We update the thread
    await this.tryApplyTag(interaction.channel, appConfig.forumTags.rejected.name);

    // We change the embed and remove all the buttons
    await interaction.message!.edit({
      embeds: [embeds.getRejectEmbed(interaction, result)],
      components: [],
    });
  }

  public async update(interaction: GuildModalInteraction, result: FeedbackModalResult): Promise<void> {
    // We add a field the embed
    await interaction.message!.edit({
      embeds: [embeds.getUpdateEmbed(interaction, result)],
    });
  }

  public async accept(interaction: GuildModalInteraction, result: FeedbackModalResult<true>): Promise<void> {
    await this.feedbackRepository.nativeUpdate(
      { statusMessageId: interaction.message!.id },
      { status: FeedbackStatus.Accepted },
    );

    // We update the thread
    await this.tryApplyTag(interaction.channel, appConfig.forumTags.accepted.name);

    // We change the embed and put a new set of buttons
    const feedbackUid = MyConstants.FeedbackModalCustomIdRegex.exec(interaction.customId)!.groups!.id!;
    await interaction.message!.edit({
      embeds: [embeds.getAcceptEmbed(interaction, result)],
      components: buttons.getAcceptedComponents(feedbackUid),
    });
  }

  public async drop(interaction: GuildModalInteraction, result: FeedbackModalResultWithPoints): Promise<void> {
    await this.feedbackRepository.nativeUpdate(
      { statusMessageId: interaction.message!.id },
      { status: FeedbackStatus.Dropped },
    );

    // We update the thread
    await this.tryApplyTag(interaction.channel, appConfig.forumTags.dropped.name);

    // We change the embed and remove all the buttons
    await interaction.message!.edit({
      embeds: [embeds.getDropEmbed(interaction, result)],
      components: [],
    });
  }

  public async implement(
    interaction: GuildModalInteraction,
    result: FeedbackModalResultWithPoints<true> & { link?: string },
  ): Promise<void> {
    await this.feedbackRepository.nativeUpdate(
      { statusMessageId: interaction.message!.id },
      { status: FeedbackStatus.Implemented },
    );

    // We update the thread
    await this.tryApplyTag(interaction.channel, appConfig.forumTags.implemented.name);

    // We change the embed and remove all the buttons
    await interaction.message!.edit({
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

  private async tryApplyTag(thread: TextBasedChannel | null, tagName: string): Promise<void> {
    if (isForumThreadChannel(thread)) {
      // Find the wanted tag in the available tags
      const resolvedTag = thread.parent.availableTags.find(tag => tag.name === tagName);
      if (resolvedTag) {
        await this.applyTag(thread, resolvedTag);
      } else {
        // Otherwise we create all the missing tags
        const allTags = Object.values(appConfig.forumTags)
          .map(tag => thread.parent.availableTags.find(forumTag => tag.name === forumTag.name) ?? tag);

        // We add the missing tags to the forum
        await thread.parent.setAvailableTags(allTags);

        // And we try to apply the tag again
        const resolvedTag2 = thread.parent.availableTags.find(tag => tag.name === tagName);
        // eslint-disable-next-line unicorn/prefer-ternary
        if (resolvedTag2)
          await this.applyTag(thread, resolvedTag2);
         else
          await thread.send(`Impossible d'ajouter le tag "${tagName}" au thread.`);
      }
    }
  }

  private async applyTag(thread: PublicThreadChannel<true>, newTag: GuildForumTag): Promise<void> {
    // Remove the "accepted" tag if we apply the "implemented" or "dropped" tag
    if ([appConfig.forumTags.implemented.name, appConfig.forumTags.dropped.name].includes(newTag.name)) {
      // Get the accepted tag id
      const acceptedTagId = thread.parent!.availableTags
        .find(tag => tag.name === appConfig.forumTags.accepted.name)?.id;
      if (acceptedTagId) {
        // Remove the accepted tag from the thread, and add the new tag
        await thread.setAppliedTags([...thread.appliedTags.filter(tagId => tagId !== acceptedTagId), newTag.id]);
        return;
      }
    }

    // Otherwise we just add the new tag
    await thread.setAppliedTags([...thread.appliedTags, newTag.id]);
  }
}
