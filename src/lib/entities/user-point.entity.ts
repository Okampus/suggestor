import { Entity, Index, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.entity';

@Entity()
export class UserPoint extends BaseEntity {
  @Property()
  @Index()
  guildId!: string;

  @Property()
  @Index()
  userId!: string;

  @Property()
  points = 0;

  constructor(options: {
    guildId: string;
    userId: string;
  }) {
    super();
    this.guildId = options.guildId;
    this.userId = options.userId;
  }
}
