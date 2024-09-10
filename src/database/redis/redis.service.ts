import { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';

import { REDIS_CLIENT } from '@/utils/constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT.providerKey)
    private readonly redisClient: Redis,
  ) {}

  getClient(): Redis {
    return this.redisClient;
  }

  async getKeys(pattern?: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }

  async set(
    key: string,
    value: string | number,
    expireTime?: number,
  ): Promise<void> {
    if (!expireTime) {
      await this.redisClient.set(key, value);
    } else {
      await this.redisClient.set(key, value, 'EX', expireTime);
    }
  }
  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<boolean> {
    const deleted = await this.redisClient.del(key);
    return deleted === 1;
  }
}
