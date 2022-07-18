import { DiscordModule } from '@discord-nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Feedback } from '../lib/entities/feedback.entity';
import { GuildConfig } from '../lib/entities/guild-config.entity';
import { UserPoint } from '../lib/entities/user-point.entity';
import * as guards from '../lib/guards';
import { ChannelsModule } from './commands/channels/channels.module';
import { PointsModule } from './commands/points/points.module';
import { FeedbackGateway } from './feedbacks/feedback.gateway';
import { FeedbackService } from './feedbacks/feedback.service';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MikroOrmModule.forFeature([GuildConfig, Feedback, UserPoint]),

    ChannelsModule,
    PointsModule,
  ],
  providers: [
    guards.ButtonInteractionGuard,
    guards.InteractionInGuildGuard,
    guards.IsFeedbackButtonGuard,
    guards.IsFeedbackModalGuard,
    guards.MessageFromUserGuard,
    guards.MessageInGuildGuard,
    guards.ModalInteractionGuard,

    FeedbackService,
    FeedbackGateway,
  ],
  exports: [],
})
export class BotModule {}
