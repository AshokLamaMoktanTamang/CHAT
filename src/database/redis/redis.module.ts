import { Redis } from 'ioredis';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Global, Module, OnApplicationShutdown } from '@nestjs/common';

import { RedisService } from './redis.service';
import { REDIS_CLIENT } from '@/utils/constants';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT.providerKey,
      useFactory: async (configService: ConfigService) => {
        const redisOptions = {
          port: configService.get('database.redis.port'),
          host: configService.get('database.redis.host'),
          keyPrefix: 'chat-api',
          name: REDIS_CLIENT.name,
        };
        return new Redis(redisOptions);
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(): Promise<void> {
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get(REDIS_CLIENT.providerKey);
      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}
