import type { DiscordGuard } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import type { Interaction } from 'discord.js';
import { PermissionsBitField } from 'discord.js';
import messagesConfig from '../../configs/messages.config';

@Injectable()
export class CanManageMessagesGuard implements DiscordGuard {
  public async canActive(_event: 'interactionCreate', [interaction]: [Interaction]): Promise<boolean> {
    if (interaction.memberPermissions!.has(PermissionsBitField.Flags.ManageMessages))
      return true;

    if (interaction.isRepliable())
      await interaction.reply({ content: messagesConfig.global.noPermission, ephemeral: true });

    return false;
  }
}
