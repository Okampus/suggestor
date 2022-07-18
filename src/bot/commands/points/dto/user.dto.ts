import { Param, ParamType } from '@discord-nestjs/core';
import messagesConfig from '../../../../configs/messages.config';

export class UserDto {
  @Param({ type: ParamType.USER, required: false, description: messagesConfig.pointsCommand.params.user })
  user?: string;
}
