import { TransformPipe } from '@discord-nestjs/common';
import type { DiscordTransformedCommand } from '@discord-nestjs/core';
import {
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import messagesConfig from '../../configs/messages.config';
import { GuildConfig } from '../../lib/entities/guild-config.entity';
import { CacheKey, DurationSeconds } from '../../lib/enums';
import { ChannelsDto } from './dto/channels.dto';

@UsePipes(TransformPipe)
@SubCommand({ name: 'remove', description: messagesConfig.channelsCommand.remove.description })
export class RemoveSubCommand implements DiscordTransformedCommand<ChannelsDto> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(GuildConfig) private readonly guildConfigRepository: EntityRepository<GuildConfig>,
  ) {}

  public async handler(
    @Payload() addDto: ChannelsDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<void> {
    // Deduplicate the provided channel IDs
    const channelIds = new Set(Object.values(addDto));

    // Retrieve the configuration set for the guild
    const config = await this.guildConfigRepository.findOne({ guildId: interaction.guild!.id });
    if (!config) {
      await interaction.reply({
        content: messagesConfig.channelsCommand.remove.none,
        ephemeral: true,
      });
      return;
    }

    // Remove the provided channel IDs from the configuration set
    config.feedbackChannelIds = config.feedbackChannelIds.filter(channelId => !channelIds.has(channelId));
    await this.guildConfigRepository.flush();

    // Uncache the provided channels
    const allCachedChannelIds = await this.cacheManager.get<Set<string>>(CacheKey.FeedbackChannelIds) ?? new Set();
    allCachedChannelIds.deleteAll(...channelIds);
    await this.cacheManager.set(CacheKey.FeedbackChannelIds, allCachedChannelIds, { ttl: DurationSeconds.OneWeek });

    await interaction.reply({
      content: messagesConfig.channelsCommand.remove.success,
      ephemeral: true,
    });
  }
}
