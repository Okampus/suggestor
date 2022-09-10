/**
 * @credits This class is adapted from the PaginatedFieldMessageEmbed class, proposed by
 * kaname-png in this PR: https://github.com/sapphiredev/utilities/pull/144
 *
 * SPDX-License-Identifier: MIT
 */

import type { PaginatedMessageOptions, PaginatedMessagePage } from '@sapphire/discord.js-utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ComponentType, EmbedBuilder } from 'discord.js';
import pupa from 'pupa';
import appConfig from '../../configs/app.config';
import messagesConfig from '../../configs/messages.config';

export class PaginatedContentMessageEmbed extends PaginatedMessage {
  private embedTemplate = new EmbedBuilder();
  private totalPages = 0;
  private items: string[] = [];
  private itemsPerPage = 10;

  constructor(options?: PaginatedMessageOptions) {
    super(options);
    this.setWrongUserInteractionReply(user => ({
      content: pupa(messagesConfig.global.wrongUserInteractionReply, { user }),
      ephemeral: true,
      allowedMentions: { users: [], roles: [] },
    }));
  }

  public setItems(items: string[]): this {
    this.items = items;
    return this;
  }

  public setItemsPerPage(itemsPerPage: number): this {
    this.itemsPerPage = itemsPerPage;
    return this;
  }

  public setTemplate(template: EmbedBuilder): this {
    this.embedTemplate = template;
    return this;
  }

  public override addPage(page: PaginatedMessagePage): this {
    if (this.pages.length === 25) {
      const actions = PaginatedMessage.defaultActions.filter(action => action.type !== ComponentType.SelectMenu);
      this.setActions(actions);
    }

    this.pages.push(page);
    return this;
  }

  public make(): this {
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
    this.generatePages();
    return this;
  }

  private generatePages(): void {
    const template = this.embedTemplate.toJSON();
    for (let i = 0; i < this.totalPages; i++) {
      const clonedTemplate = new EmbedBuilder(template);

      if (!clonedTemplate.data.color)
        clonedTemplate.setColor(appConfig.colors.default);

      const data = this.paginateArray(this.items, i, this.itemsPerPage);
      this.addPage({
        embeds: [clonedTemplate.setDescription(data.join('\n'))],
      });
    }
  }

  private paginateArray(items: string[], currentPage: number, perPageItems: number): string[] {
    const offset = currentPage * perPageItems;
    return items.slice(offset, offset + perPageItems);
  }
}
