import type { DiscordCommand } from '@discord-nestjs/core';
import { SubCommand } from '@discord-nestjs/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import type { CommandInteraction } from 'discord.js';
import pupa from 'pupa';
import messagesConfig from '../../configs/messages.config';
import { GuildConfig } from '../../lib/entities/guild-config.entity';

@SubCommand({ name: 'show', description: messagesConfig.channelsCommand.show.description })
export class ShowSubCommand implements DiscordCommand {
  constructor(
    @InjectRepository(GuildConfig) private readonly guildConfigRepository: EntityRepository<GuildConfig>,
  ) {}

  public async handler(interaction: CommandInteraction): Promise<void> {
    // Retrieve the configuration set for the guild
    const config = await this.guildConfigRepository.findOne({ guildId: interaction.guild!.id });

    // If none is found, or no channel are set, return a message
    if (!config?.feedbackChannelId) {
      await interaction.reply({
        content: messagesConfig.channelsCommand.show.none,
        ephemeral: true,
      });
      return;
    }

    // Retrieve the channel objects
    const channel = interaction.guild!.channels.cache.get(config.feedbackChannelId);

    // Display the channels
    await interaction.reply({
      content: pupa(messagesConfig.channelsCommand.show.list, { channel: channel?.toString() }),
      ephemeral: true,
    });
  }
}
