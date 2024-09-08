import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.mongoUri'),
      }),
    }),
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
