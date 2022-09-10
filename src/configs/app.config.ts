import type { ColorResolvable } from 'discord.js';

if (!process.env.DISCORD_TOKEN)
  throw new Error('DISCORD_TOKEN is not set');

export default {
  token: process.env.DISCORD_TOKEN,
  nodeEnv: process.env.NODE_ENV as 'development' | 'production',
  colors: {
    primary: '#5bb78f' as ColorResolvable,
    default: '#439bf2' as ColorResolvable,
    white: '#ffffff' as ColorResolvable,
    green: '#32a852' as ColorResolvable,
    yellow: '#e0c748' as ColorResolvable,
    orange: '#f27938' as ColorResolvable,
    red: '#eb2d1c' as ColorResolvable,
    gray: '#4f4f4f' as ColorResolvable,
    transparent: '#2f3136' as ColorResolvable,
  },
};
