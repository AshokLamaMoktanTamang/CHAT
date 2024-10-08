import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { RedisModule } from './redis/redis.module';
import { MongoService } from './mongo/mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.mongoUri'),
      }),
    }),
    RedisModule,
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class DatabaseModule {}
