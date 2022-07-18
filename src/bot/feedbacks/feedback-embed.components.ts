import { Constants, MessageEmbed } from 'discord.js';
import pupa from 'pupa';
import messagesConfig from '../../configs/messages.config';
import type { GuildMessage, GuildModalInteraction } from '../../lib/types';

interface ActionResult<Optional extends boolean = false> {
  reason: Optional extends true ? string | undefined : string;
}

interface ActionResultWithPoints<Optional extends boolean = false> extends ActionResult<Optional> {
  points: number;
  total: number;
}

function date(): number {
  return Math.round(Date.now() / 1000);
}

export function getStatusEmbed(message: GuildMessage, feedbackId: number): MessageEmbed {
  return new MessageEmbed()
    .setAuthor({
      name: pupa(messagesConfig.feedback.embed.title, { feedbackId, member: message.member }),
      iconURL: message.author.displayAvatarURL(),
    })
    .setDescription(messagesConfig.feedback.embed.defaultDescription)
    .setColor(Constants.Colors.WHITE);
}

function getEmbed(
  interaction: GuildModalInteraction,
  fieldTitle: keyof typeof messagesConfig.feedback.embed,
  fieldValue: string,
): MessageEmbed {
  const embed = interaction.message.embeds[0];
  embed.setDescription('');
  embed.addField(
    pupa(messagesConfig.feedback.embed[fieldTitle], { member: interaction.member, date: date() }),
    fieldValue,
  );
  return embed;
}

export function getRejectEmbed(interaction: GuildModalInteraction, result: ActionResultWithPoints): MessageEmbed {
  const embed = getEmbed(interaction, 'rejectFieldTitle', result.reason);
  embed.setColor(Constants.Colors.RED);
  embed.setFooter({
    text: pupa(messagesConfig.feedback.embed.pointsEarned, { points: result.points, total: result.total }),
  });
  return embed;
}

export function getUpdateEmbed(interaction: GuildModalInteraction, result: ActionResult): MessageEmbed {
  return getEmbed(interaction, 'updateFieldTitle', result.reason);
}

export function getAcceptEmbed(interaction: GuildModalInteraction, result?: ActionResult<true>): MessageEmbed {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const embed = getEmbed(interaction, 'acceptFieldTitle', result?.reason || messagesConfig.feedback.embed.acceptFieldReason);
  embed.setColor(Constants.Colors.GREEN);
  return embed;
}

export function getDropEmbed(interaction: GuildModalInteraction, result: ActionResultWithPoints): MessageEmbed {
  const embed = getEmbed(interaction, 'dropFieldTitle', result.reason);
  embed.setColor(Constants.Colors.DARK_RED);
  embed.setFooter({
    text: pupa(messagesConfig.feedback.embed.pointsEarned, { points: result.points, total: result.total }),
  });
  return embed;
}

export function getImplementEmbed(
  interaction: GuildModalInteraction,
  result: ActionResultWithPoints<true> & { link?: string },
): MessageEmbed {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const embed = getEmbed(interaction, 'implementFieldTitle', result?.reason || messagesConfig.feedback.embed.implementFieldReason);

  if (result?.link) {
    embed.setURL(result.link);
    embed.setTitle(messagesConfig.feedback.embed.urlTitle);
  }

  embed.setColor(Constants.Colors.DARK_GREEN);
  embed.setFooter({
    text: pupa(messagesConfig.feedback.embed.pointsEarned, { points: result.points, total: result.total }),
  });
  return embed;
}
