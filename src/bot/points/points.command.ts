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
import messagesConfig from '../../configs/messages.config';
import { UserPoint } from '../../lib/entities/user-point.entity';
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
    // Retrieve the user points
    const userPoint = await this.userPointRepository.findOne({
      guildId: interaction.guild!.id,
      userId: userDto?.user ?? interaction.user.id,
    });

    const betterUsers = await this.userPointRepository.count({
      guildId: interaction.guild!.id,
      points: { $gt: userPoint?.points ?? 0 },
    });
    const rank = betterUsers + 1;

    const content = userDto?.user
      ? messagesConfig.pointsCommand.someonesPoints
      : messagesConfig.pointsCommand.selfPoints;

    const suffix = rank === 1 ? 'er' : 'e';
    await interaction.reply(pupa(content, {
      user: userDto.user,
      points: userPoint?.points ?? 0,
      rank,
      suffix,
    }));
  }
}
