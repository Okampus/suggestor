import { TransformPipe } from '@discord-nestjs/common';
import type { DiscordTransformedCommand } from '@discord-nestjs/core';
import {
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UseGuards,
  UsePipes,
} from '@discord-nestjs/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import messagesConfig from '../../configs/messages.config';
import { GuildConfig } from '../../lib/entities/guild-config.entity';
import { CacheKey, DurationSeconds } from '../../lib/enums';
import { IsAdministratorGuard } from '../../lib/guards';
import { ChannelsDto } from './dto/channels.dto';

@UseGuards(IsAdministratorGuard)
@UsePipes(TransformPipe)
@SubCommand({ name: 'add', description: messagesConfig.channelsCommand.add.description })
export class AddSubCommand implements DiscordTransformedCommand<ChannelsDto> {
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
    if (config) {
      // Update the configuration with the new channels
      channelIds.addAll(...config.feedbackChannelIds);
      config.feedbackChannelIds = [...channelIds];
    } else {
      // Create a new configuration with the new channels
      const newConfig = new GuildConfig({ guildId: interaction.guild!.id, feedbackChannelIds: [...channelIds] });
      this.guildConfigRepository.persist(newConfig);
    }

    // Save the configuration
    await this.guildConfigRepository.flush();

    // Cache the newly provided channels
    const allCachedChannelIds = await this.cacheManager.get<Set<string>>(CacheKey.FeedbackChannelIds) ?? new Set();
    allCachedChannelIds.addAll(...channelIds);
    await this.cacheManager.set(CacheKey.FeedbackChannelIds, allCachedChannelIds, { ttl: DurationSeconds.OneWeek });

    await interaction.reply({
      content: messagesConfig.channelsCommand.add.success,
      ephemeral: true,
    });
  }
}
