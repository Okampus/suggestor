import type { DiscordCommand } from '@discord-nestjs/core';
import { Command } from '@discord-nestjs/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import type { CommandInteraction } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import pupa from 'pupa';
import messagesConfig from '../../configs/messages.config';
import { UserPoint } from '../../lib/entities/user-point.entity';

@Command({
  name: 'leaderboard',
  description: messagesConfig.leaderboardCommand.description,
})
export class LeaderboardCommand implements DiscordCommand {
  constructor(
    @InjectRepository(UserPoint) private readonly userPointRepository: EntityRepository<UserPoint>,
  ) {}

  public async handler(interaction: CommandInteraction): Promise<void> {
    // Retrieve the leaderboard for the guild
    const leaderboard = await this.userPointRepository.find(
      { guildId: interaction.guild!.id },
      { orderBy: { points: 'desc' }, limit: 10 },
    );

    // Display the leaderboard in an embed
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(messagesConfig.leaderboardCommand.leaderboardTitle)
          .setDescription(
            leaderboard
              .filter(Boolean)
              .map((userPoint, index) => pupa(messagesConfig.leaderboardCommand.leaderboardLine, {
                rank: index + 1,
                user: userPoint.userId,
                points: userPoint.points,
              }))
              .join('\n'),
          ),
      ],
    });
  }
}
