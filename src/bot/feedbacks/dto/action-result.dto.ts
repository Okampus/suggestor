import { TextInputValue } from '@discord-nestjs/core';

export class ActionResultDto {
  @TextInputValue('feedback-modal-reason')
  reason!: string;

  @TextInputValue('feedback-modal-link')
  link?: string;

  @TextInputValue('feedback-modal-points')
  points?: string;
}
