import type { DiscordGuard } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import type { Message } from 'discord.js';

@Injectable()
export class MessageFromUserGuard implements DiscordGuard {
  public canActive(_event: 'messageCreate', [message]: [Message]): boolean {
    return !message.author.bot;
  }
}
