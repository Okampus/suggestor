import type { DiscordGuard } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import type { Interaction } from 'discord.js';
import { Constants } from '../utils';

@Injectable()
export class IsFeedbackButtonGuard implements DiscordGuard {
  public canActive(_event: 'interactionCreate', [interaction]: [Interaction]): boolean {
    return interaction.isButton() && Constants.FeedbackButtonCustomIdRegex.test(interaction.customId);
  }
}
