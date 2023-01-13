import {
  Entity,
  Enum,
  Index,
  Property,
} from '@mikro-orm/core';
import { FeedbackStatus } from '../enums';
import { BaseEntity } from './base-entity.entity';

@Entity()
export class Feedback extends BaseEntity {
  @Property()
  @Index()
  guildId!: string;

  @Property()
  channelId!: string;

  @Property()
  threadId!: string;

  @Property()
  @Index()
  messageId!: string;

  @Property()
  authorId!: string;

  @Property()
  statusMessageId!: string;

  @Enum(() => FeedbackStatus)
  status: FeedbackStatus = FeedbackStatus.Pending;

  @Property()
  feedbackId!: number;

  constructor(options: {
    guildId: string;
    channelId: string;
    threadId: string;
    messageId: string;
    authorId: string;
    statusMessageId?: string;
    feedbackId: number;
  }) {
    super();
    this.guildId = options.guildId;
    this.channelId = options.channelId;
    this.threadId = options.threadId;
    this.messageId = options.messageId;
    this.authorId = options.authorId;
    this.statusMessageId = '';
    this.feedbackId = options.feedbackId;
  }
}
