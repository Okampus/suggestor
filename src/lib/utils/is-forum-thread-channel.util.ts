import type { PublicThreadChannel, TextBasedChannel } from 'discord.js';
import { ChannelType } from 'discord.js';

type CachedForumThread = PublicThreadChannel<true> & { parent: NonNullable<PublicThreadChannel<true>['parent']> };

/**
 * Checks that a given {TextBasedChannel} is a forum thread channel
 * @param channel The channel to check for
 * @returns A boolean, true if the channel is a forum thread channel, false otherwise
 */
export function isForumThreadChannel(channel: TextBasedChannel | null): channel is CachedForumThread {
  if (!channel)
    return false;

  return channel.isThread() && channel.parent?.type === ChannelType.GuildForum;
}
