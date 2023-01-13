import type { DiscordGuard } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import type { ThreadChannel } from 'discord.js';

@Injectable()
export class EnsureStarterMessageGuard implements DiscordGuard {
  public async canActive(_event: 'threadCreate', [threadChannel]: [ThreadChannel]): Promise<boolean> {
    const message = await threadChannel.fetchStarterMessage().catch(() => null);
    return Boolean(message);
  }
}
