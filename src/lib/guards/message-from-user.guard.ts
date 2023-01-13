import type { DiscordGuard } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import type { ThreadChannel } from 'discord.js';

@Injectable()
export class MessageFromUserGuard implements DiscordGuard {
  public canActive(_event: 'threadCreate', [threadChannel]: [ThreadChannel]): boolean {
    return !threadChannel.messages.cache.first()!.author.bot;
  }
}
