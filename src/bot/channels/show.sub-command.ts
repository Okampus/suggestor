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
    if (!config || config.feedbackChannelIds.length === 0) {
      await interaction.reply({
        content: messagesConfig.channelsCommand.show.none,
        ephemeral: true,
      });
      return;
    }

    // Retrieve the channel objects
    const channels = interaction.guild!.channels.cache
      .filter(channel => config.feedbackChannelIds.includes(channel.id));

    // Display the channels
    await interaction.reply({
      content: pupa(messagesConfig.channelsCommand.show.list, {
        channels: [...channels.map(channel => channel.toString()).values()].join(', '),
      }),
      ephemeral: true,
    });
  }
}
