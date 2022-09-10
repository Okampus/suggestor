import type { TimestampStylesString } from 'discord.js';

/**
 * Formats a timestamp into a readable Discord-formatted time
 *
 * @param date The date to format
 * @param style The style to use, defaults to the full date
 * @returns The Discord-formatted time
 */
export function timeFormat(text: string, style?: TimestampStylesString): string {
  return typeof style === 'string' ? `<t:${text}:${style}>` : `<t:${text}>`;
}
