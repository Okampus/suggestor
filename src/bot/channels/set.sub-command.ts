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
import { ChannelType } from 'discord.js';
import appConfig from '../../configs/app.config';
import messagesConfig from '../../configs/messages.config';
import { GuildConfig } from '../../lib/entities/guild-config.entity';
import { CacheKey, DurationMs } from '../../lib/enums';
import { ChannelDto } from './dto/channels.dto';

@UsePipes(TransformPipe)
@SubCommand({ name: 'set', description: messagesConfig.channelsCommand.set.description })
export class SetSubCommand implements DiscordTransformedCommand<ChannelDto> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(GuildConfig) private readonly guildConfigRepository: EntityRepository<GuildConfig>,
  ) {}

  public async handler(
    @Payload() setDto: ChannelDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<void> {
    const channelId = setDto.channel;
    const channel = await interaction.guild!.channels.fetch(channelId);
    if (channel?.type !== ChannelType.GuildForum) {
      await interaction.reply({
        content: messagesConfig.channelsCommand.set.notForum,
        ephemeral: true,
      });
      return;
    }

    // Retrieve the configuration set for the guild
    const config = await this.guildConfigRepository.findOne({ guildId: interaction.guildId! });
    if (config) {
      // Update the configuration with the new channels
      config.feedbackChannelId = channelId;
    } else {
      // Create a new configuration with the new channels
      const newConfig = new GuildConfig({ guildId: interaction.guildId!, feedbackChannelId: channelId });
      this.guildConfigRepository.persist(newConfig);
    }

    // Save the configuration
    await this.guildConfigRepository.flush();

    // Cache the newly provided channels
    await this.cacheManager.set(`${CacheKey.FeedbackChannelId}.${interaction.guildId!}`, channelId, DurationMs.OneWeek);

    // Reset the forum's tags
    await channel.setAvailableTags(Object.values(appConfig.forumTags));

    await interaction.reply({
      content: messagesConfig.channelsCommand.set.success,
      ephemeral: true,
    });
  }
}
