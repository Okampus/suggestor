import { Entity, Index, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.entity';

@Entity()
export class GuildConfig extends BaseEntity {
  @Property()
  @Index()
  guildId!: string;

  @Property()
  feedbackChannelIds: string[] = [];

  constructor(options: {
    guildId: string;
    feedbackChannelIds?: string[];
  }) {
    super();
    this.guildId = options.guildId;
    if (options.feedbackChannelIds)
      this.feedbackChannelIds = options.feedbackChannelIds;
  }
}
