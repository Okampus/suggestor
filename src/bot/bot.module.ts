import { Module } from '@nestjs/common';
import { ChannelsModule } from './channels/channels.module';
import { FeedbackModule } from './feedbacks/feedback.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [
    ChannelsModule,
    FeedbackModule,
    PointsModule,
  ],
})
export class BotModule {}
