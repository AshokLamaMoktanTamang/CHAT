import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { MailModule } from '@/mail/mail.module';
import { ConfigModule } from '@/config/config.module';
import { BcryptModule } from '@/bcrypt/bcrypt.module';
import { FriendsModule } from '@/friends/friends.module';
import { QueueModule } from '@/helpers/queue/queue.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    QueueModule,
    MailModule,
    BcryptModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
