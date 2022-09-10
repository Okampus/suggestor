import { Param, ParamType } from '@discord-nestjs/core';
import messagesConfig from '../../../configs/messages.config';
import { UserDto } from './user.dto';

export class UpdatePointsDto extends UserDto {
  @Param({ type: ParamType.INTEGER, required: true, description: messagesConfig.managePointsCommand.params.amount })
  amount!: number;
}
