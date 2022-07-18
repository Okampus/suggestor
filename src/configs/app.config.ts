if (!process.env.DISCORD_TOKEN)
  throw new Error('DISCORD_TOKEN is not set');

export default {
  token: process.env.DISCORD_TOKEN,
  nodeEnv: process.env.NODE_ENV as 'development' | 'production',
};
