import type { DiscordGuard } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import type { Interaction } from 'discord.js';

@Injectable()
export class InteractionInGuildGuard implements DiscordGuard {
  public canActive(_event: 'interactionCreate', [interaction]: [Interaction]): boolean {
    return interaction.inGuild();
  }
}
