import { TRANSFORMER_OPTION } from '@discord-nestjs/common';
import type { DiscordArgumentMetadata, DiscordPipeTransform } from '@discord-nestjs/core';
import { ReflectMetadataProvider } from '@discord-nestjs/core';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import type { ModalSubmitInteraction, PartialTextInputData } from 'discord.js';

@Injectable()
export class CustomModalFieldsTransformPipe implements DiscordPipeTransform {
  constructor(
    private readonly metadataProvider: ReflectMetadataProvider,
    @Optional() @Inject(TRANSFORMER_OPTION) private readonly classTransformerOptions?: ClassTransformOptions,
  ) {}

  public transform(
    [modal]: [ModalSubmitInteraction],
    metadata: DiscordArgumentMetadata<'interactionCreate'>,
  ): ReturnType<typeof plainToInstance> {
    if (!metadata.metatype || !modal)
      return;

    // eslint-disable-next-line prefer-destructuring
    const dtoInstance: object = metadata.commandNode.dtoInstance;
    const plainObject: Record<string, PartialTextInputData | string> = {};

    for (const property of Object.keys(dtoInstance)) {
      const fieldMetadata = this.metadataProvider.getFiledDecoratorMetadata(dtoInstance, property);
      if (fieldMetadata) {
        try {
          plainObject[property] = modal.fields.getField(fieldMetadata.customId ?? property);
        } catch { /* Ignore non-existant fields */ }
        continue;
      }

      const textInputValueMetadata = this.metadataProvider.getTextInputValueDecoratorMetadata(dtoInstance, property);
      if (textInputValueMetadata) {
        try {
          plainObject[property] = modal.fields.getTextInputValue(textInputValueMetadata.customId ?? property);
        } catch { /* Ignore non-existant fields */ }
        continue;
      }
    }

    return plainToInstance(metadata.metatype, plainObject, this.classTransformerOptions);
  }
}
