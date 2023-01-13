import { DiscordModule } from '@discord-nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule, Module } from '@nestjs/common';
import { GatewayIntentBits } from 'discord.js';
import { BotModule } from './bot/bot.module';
import config from './configs/app.config';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    DiscordModule.forRootAsync({
      useFactory: () => ({
        token: config.token,
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
          ],
        },
        registerCommandOptions: [{ forGuild: '459993816468815894', removeCommandsBefore: true }],
      }),
    }),
    MikroOrmModule.forRoot(),

    BotModule,
  ],
})
export class AppModule {}
