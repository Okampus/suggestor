import { UsePipes } from '@discord-nestjs/core';
import { applyDecorators } from '@nestjs/common';
import { CustomModalFieldsTransformPipe } from '../pipes';

export function ParseModal(): MethodDecorator {
  return applyDecorators(UsePipes(CustomModalFieldsTransformPipe));
}
