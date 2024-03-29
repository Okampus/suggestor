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
import { UpdatePointsDto } from './dto/update-points.dto';

@UsePipes(TransformPipe)
@SubCommand({ name: 'remove', description: messagesConfig.managePointsCommand.remove.description })
export class RemoveSubCommand implements DiscordTransformedCommand<UpdatePointsDto> {
  constructor(
    @InjectRepository(UserPoint) private readonly userPointRepository: EntityRepository<UserPoint>,
  ) {}

  public async handler(
    @Payload() updatePointsDto: UpdatePointsDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<void> {
    let userPoint = await this.userPointRepository.findOne({ userId: updatePointsDto.user });
    if (!userPoint) {
      userPoint = new UserPoint({ guildId: interaction.guildId!, userId: updatePointsDto.user });
      this.userPointRepository.persist(userPoint);
    }

    userPoint.points = Math.max(userPoint.points - updatePointsDto.amount, 0);
    await this.userPointRepository.flush();

    await interaction.reply({
      content: pupa(messagesConfig.managePointsCommand.remove.success, { ...updatePointsDto, ...userPoint }),
      allowedMentions: { users: [] },
      ephemeral: true,
    });
  }
}
