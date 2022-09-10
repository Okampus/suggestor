import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import messagesConfig from '../../configs/messages.config';

export function getStatusEmbedComponents(feedbackUid: string): Array<ActionRowBuilder<ButtonBuilder>> {
  return [
    new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel(messagesConfig.feedback.buttons.reject)
          .setCustomId(`feedback-reject-button-${feedbackUid}`),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel(messagesConfig.feedback.buttons.update)
          .setCustomId(`feedback-update-button-${feedbackUid}`),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel(messagesConfig.feedback.buttons.accept)
          .setCustomId(`feedback-accept-button-${feedbackUid}`),
      ),
  ];
}

export function getAcceptedComponents(feedbackUid: string): Array<ActionRowBuilder<ButtonBuilder>> {
  return [
    new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel(messagesConfig.feedback.buttons.drop)
          .setCustomId(`feedback-drop-button-${feedbackUid}`),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel(messagesConfig.feedback.buttons.implement)
          .setCustomId(`feedback-implement-button-${feedbackUid}`),
      ),
  ];
}
