import { TransformPipe } from '@discord-nestjs/common';
import type { DiscordTransformedCommand } from '@discord-nestjs/core';
import {
  Command,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import pupa from 'pupa';
import messagesConfig from '../../../configs/messages.config';
import { UserPoint } from '../../../lib/entities/user-point.entity';
import { UserDto } from './dto/user.dto';

@UsePipes(TransformPipe)
@Command({
  name: 'points',
  description: messagesConfig.pointsCommand.description,
})
export class PointsCommand implements DiscordTransformedCommand<UserDto> {
  constructor(
    @InjectRepository(UserPoint) private readonly userPointRepository: EntityRepository<UserPoint>,
  ) {}

  public async handler(
    @Payload() userDto: UserDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<void> {
    // Retrieve the configuration set for the guild
    const userPoint = await this.userPointRepository.findOne({
      guildId: interaction.guild!.id,
      userId: userDto?.user ?? interaction.user.id,
    });

    if (userDto?.user) {
      // Display someone else's points
      await interaction.reply({
        content: pupa(messagesConfig.pointsCommand.someonesPoints, {
          user: userDto.user,
          points: userPoint?.points ?? 0,
        }),
        ephemeral: true,
      });
    } else {
      // Display our points
      await interaction.reply({
        content: pupa(messagesConfig.pointsCommand.selfPoints, { points: userPoint?.points ?? 0 }),
        ephemeral: true,
      });
    }
  }
}
