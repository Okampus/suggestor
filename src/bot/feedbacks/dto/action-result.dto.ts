import { TextInputValue } from '@discord-nestjs/core';
import { Transform } from 'class-transformer';

export class ActionResultDto {
  @TextInputValue('feedback-modal-reason')
  reason!: string;

  @TextInputValue('feedback-modal-link')
  link?: string;

  @TextInputValue('feedback-modal-points')
  @Transform(({ value }) => Number(value) || 0)
  points!: number;
}
