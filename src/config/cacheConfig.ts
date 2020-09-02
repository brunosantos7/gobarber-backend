import { RedisOptions } from 'ioredis';

type CacheConfig = {
  driver: 'redis';

  config: {
    redis: RedisOptions;
  };
};

export default {
  driver: 'redis',

  config: {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASS || undefined,
    },
  },
} as CacheConfig;
