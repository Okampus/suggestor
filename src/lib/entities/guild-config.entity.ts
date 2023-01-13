import { Entity, Index, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.entity';

@Entity()
export class GuildConfig extends BaseEntity {
  @Property()
  @Index()
  guildId!: string;

  @Property()
  feedbackChannelId: string | null = null;

  constructor(options: {
    guildId: string;
    feedbackChannelId?: string;
  }) {
    super();
    this.guildId = options.guildId;
    if (options.feedbackChannelId)
      this.feedbackChannelId = options.feedbackChannelId;
  }
}
