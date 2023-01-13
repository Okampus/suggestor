import type { ButtonInteraction, Message, ModalSubmitInteraction } from 'discord.js';

export type GuildMessage = Message<true>;

export type GuildButtonInteraction = ButtonInteraction<'cached'>;

export type GuildModalInteraction = ModalSubmitInteraction<'cached'>;

export type FeedbackState = 'accept' | 'drop' | 'implement' | 'reject' | 'update';
