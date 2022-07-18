import type {
  ButtonInteraction,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  Message,
  ModalSubmitInteraction,
} from 'discord.js';

export interface GuildMessage extends Message {
  readonly channel: GuildTextBasedChannel;
  readonly guild: Guild;
  readonly member: GuildMember;
}

export interface GuildButtonInteraction extends ButtonInteraction {
  readonly message: GuildMessage;
  readonly guild: Guild;
}

export interface GuildModalInteraction extends ModalSubmitInteraction {
  readonly message: GuildMessage;
  readonly guild: Guild;
}

export type FeedbackState = 'accept' | 'drop' | 'implement' | 'reject' | 'update';
