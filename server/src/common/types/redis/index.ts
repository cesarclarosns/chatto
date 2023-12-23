import { createClient } from 'redis';

export type TRedisClientOptions = Parameters<typeof createClient>[0];
