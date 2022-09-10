import { TransformPipe } from '@discord-nestjs/common';
import type { DiscordTransformedCommand } from '@discord-nestjs/core';
import {
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import pupa from 'pupa';
import messagesConfig from '../../configs/messages.config';
import { UserPoint } from '../../lib/entities/user-point.entity';
import { UserDto } from './dto/user.dto';

@UsePipes(TransformPipe)
@SubCommand({ name: 'show', description: messagesConfig.managePointsCommand.show.description })
export class ShowSubCommand implements DiscordTransformedCommand<UserDto> {
  constructor(
    @InjectRepository(UserPoint) private readonly userPointRepository: EntityRepository<UserPoint>,
  ) {}

  public async handler(
    @Payload() userDto: UserDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<void> {
    const userPoint = await this.userPointRepository.findOne({ userId: userDto.user });
    if (!userPoint) {
      await interaction.reply({
        content: pupa(messagesConfig.managePointsCommand.show.noPoints, { userId: userDto.user }),
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: pupa(messagesConfig.managePointsCommand.show.userPoints, { ...userPoint }),
      ephemeral: true,
    });
  }
}
