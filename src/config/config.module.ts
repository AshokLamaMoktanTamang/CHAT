import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import configEnv from './config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configEnv],
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class ConfigModule {}
