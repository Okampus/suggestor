import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { FeedbackModule } from './feedbacks/feedback.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ManagePointsModule } from './manage-points/manage-points.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [
    ChannelsModule,
    FeedbackModule,
    LeaderboardModule,
    ManagePointsModule,
    PointsModule,
  ],
})
export class BotModule {}
