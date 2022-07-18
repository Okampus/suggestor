import { MessageActionRow, MessageButton } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import messagesConfig from '../../configs/messages.config';

export function getStatusEmbedComponents(feedbackUid: string): MessageActionRow[] {
  return [
    new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle(MessageButtonStyles.DANGER)
          .setLabel(messagesConfig.feedback.buttons.reject)
          .setCustomId(`feedback-reject-button-${feedbackUid}`),
        new MessageButton()
          .setStyle(MessageButtonStyles.SECONDARY)
          .setLabel(messagesConfig.feedback.buttons.update)
          .setCustomId(`feedback-update-button-${feedbackUid}`),
        new MessageButton()
          .setStyle(MessageButtonStyles.SUCCESS)
          .setLabel(messagesConfig.feedback.buttons.accept)
          .setCustomId(`feedback-accept-button-${feedbackUid}`),
      ),
  ];
}

export function getAcceptedComponents(feedbackUid: string): MessageActionRow[] {
  return [
    new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle(MessageButtonStyles.DANGER)
          .setLabel(messagesConfig.feedback.buttons.drop)
          .setCustomId(`feedback-drop-button-${feedbackUid}`),
        new MessageButton()
          .setStyle(MessageButtonStyles.SUCCESS)
          .setLabel(messagesConfig.feedback.buttons.implement)
          .setCustomId(`feedback-implement-button-${feedbackUid}`),
      ),
  ];
}
