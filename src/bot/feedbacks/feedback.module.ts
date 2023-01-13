import { DiscordModule } from '@discord-nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Feedback } from '../../lib/entities/feedback.entity';
import { GuildConfig } from '../../lib/entities/guild-config.entity';
import { UserPoint } from '../../lib/entities/user-point.entity';
import * as guards from '../../lib/guards';
import { FeedbackGateway } from './feedback.gateway';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MikroOrmModule.forFeature([GuildConfig, Feedback, UserPoint]),
  ],
  providers: [
    guards.ButtonInteractionGuard,
    guards.CanManageMessagesGuard,
    guards.EnsureStarterMessageGuard,
    guards.InteractionInGuildGuard,
    guards.IsFeedbackButtonGuard,
    guards.IsFeedbackModalGuard,
    guards.MessageFromUserGuard,
    guards.ModalInteractionGuard,

    FeedbackService,
    FeedbackGateway,
  ],
  exports: [],
})
export class FeedbackModule {}
