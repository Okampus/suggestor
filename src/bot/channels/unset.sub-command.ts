import type { DiscordCommand } from '@discord-nestjs/core';
import { SubCommand } from '@discord-nestjs/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import type { ChatInputCommandInteraction } from 'discord.js';
import messagesConfig from '../../configs/messages.config';
import { GuildConfig } from '../../lib/entities/guild-config.entity';
import { CacheKey } from '../../lib/enums';

@SubCommand({ name: 'unset', description: messagesConfig.channelsCommand.unset.description })
export class UnsetSubCommand implements DiscordCommand {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(GuildConfig) private readonly guildConfigRepository: EntityRepository<GuildConfig>,
  ) {}

  public async handler(interaction: ChatInputCommandInteraction): Promise<void> {
    // Retrieve the configuration set for the guild
    const config = await this.guildConfigRepository.findOne({ guildId: interaction.guild!.id });
    if (!config) {
      await interaction.reply({
        content: messagesConfig.channelsCommand.unset.none,
        ephemeral: true,
      });
      return;
    }

    // Remove the provided channel IDs from the configuration set
    config.feedbackChannelId = null;
    await this.guildConfigRepository.flush();

    // Uncache the provided channels
    await this.cacheManager.del(`${CacheKey.FeedbackChannelId}.${interaction.guildId!}`);

    await interaction.reply({
      content: messagesConfig.channelsCommand.unset.success,
      ephemeral: true,
    });
  }
}
