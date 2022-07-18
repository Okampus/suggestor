import { EmbedLimits } from '@sapphire/discord-utilities';
import type { ModalActionRowComponent } from 'discord.js';
import { MessageActionRow, Modal, TextInputComponent } from 'discord.js';
import { TextInputStyles } from 'discord.js/typings/enums';
import pupa from 'pupa';
import messagesConfig from '../../configs/messages.config';
import type { Feedback } from '../../lib/entities/feedback.entity';
import type { FeedbackState, GuildButtonInteraction } from '../../lib/types';

async function getBaseModal(
  interaction: GuildButtonInteraction,
  feedback: Feedback,
  action: FeedbackState,
  optional = false,
): Promise<Modal> {
  const member = await interaction.guild.members.fetch(feedback.authorId);
  const modal = new Modal()
    .setTitle(pupa(messagesConfig.feedback.embed.title, { feedbackId: feedback.feedbackId, member }))
    .setCustomId(`feedback-${action}-modal-${feedback.id}`);

  const reasonInput = new TextInputComponent()
    .setLabel(messagesConfig.feedback.modal.reasonLabel)
    .setRequired(!optional)
    .setStyle(TextInputStyles.PARAGRAPH)
    .setPlaceholder(messagesConfig.feedback.modal.reasonPlaceholder)
    .setMaxLength(EmbedLimits.MaximumFieldValueLength)
    .setCustomId('feedback-modal-reason');

  modal.addComponents(
    new MessageActionRow<ModalActionRowComponent>().addComponents(reasonInput),
  );

  return modal;
}

function addPointFieldToModal(modal: Modal): void {
  const pointsInput = new TextInputComponent()
    .setLabel(messagesConfig.feedback.modal.pointsLabel)
    .setRequired(false)
    .setStyle(TextInputStyles.SHORT)
    .setPlaceholder(messagesConfig.feedback.modal.pointsPlaceholder)
    .setMaxLength(3)
    .setCustomId('feedback-modal-points');

  modal.addComponents(
    new MessageActionRow<ModalActionRowComponent>().addComponents(pointsInput),
  );
}

export async function reject(interaction: GuildButtonInteraction, feedback: Feedback): Promise<Modal> {
  // We return a modal with a reason and a points field
  const modal = await getBaseModal(interaction, feedback, 'reject');
  addPointFieldToModal(modal);
  return modal;
}

export async function update(interaction: GuildButtonInteraction, feedback: Feedback): Promise<Modal> {
  // We return a modal with a reason field
  return await getBaseModal(interaction, feedback, 'update');
}

export async function accept(interaction: GuildButtonInteraction, feedback: Feedback): Promise<Modal> {
  // We return a modal with a reason field
  return await getBaseModal(interaction, feedback, 'accept', true);
}

export async function drop(interaction: GuildButtonInteraction, feedback: Feedback): Promise<Modal> {
  // We return a modal with a reason and a points field
  const modal = await getBaseModal(interaction, feedback, 'drop');
  addPointFieldToModal(modal);
  return modal;
}

export async function implement(interaction: GuildButtonInteraction, feedback: Feedback): Promise<Modal> {
  // We return a modal with a reason, a points, and a link field
  const modal = await getBaseModal(interaction, feedback, 'implement', true);
  addPointFieldToModal(modal);

  const linkInput = new TextInputComponent()
    .setLabel(messagesConfig.feedback.modal.linkLabel)
    .setRequired(false)
    .setStyle(TextInputStyles.SHORT)
    .setPlaceholder(messagesConfig.feedback.modal.linkPlaceholder)
    .setCustomId('feedback-modal-link');

  modal.addComponents(
    new MessageActionRow<ModalActionRowComponent>().addComponents(linkInput),
  );

  return modal;
}
