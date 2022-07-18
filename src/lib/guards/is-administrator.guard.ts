import type { DiscordGuard } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import type { Interaction } from 'discord.js';
import { Permissions } from 'discord.js';
import messagesConfig from '../../configs/messages.config';

@Injectable()
export class IsAdministratorGuard implements DiscordGuard {
  public async canActive(_event: 'interactionCreate', [interaction]: [Interaction]): Promise<boolean> {
    if (interaction.memberPermissions!.has(Permissions.FLAGS.ADMINISTRATOR))
      return true;

    if (interaction.isRepliable())
      await interaction.reply({ content: messagesConfig.global.noPermission, ephemeral: true });

    return false;
  }
}
