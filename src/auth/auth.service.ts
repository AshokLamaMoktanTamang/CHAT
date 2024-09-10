import { ConflictException, Injectable } from '@nestjs/common';

import { UserService } from '@/user/user.service';
import { MailService } from '@/mail/mail.service';

import { CreateUserDto } from '@/user/dto/create-query.dto';
import { RedisService } from '@/database/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {}

  async addUserInCache(data: CreateUserDto) {
    const { email } = data;

    const existingCacheUser = await this.redisService.get(`${email}`);
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser || existingCacheUser)
      throw new ConflictException('User With Email already exist');

    await this.redisService.set(`${email}`, JSON.stringify(data), 24 * 60 * 60);

    return data;
  }

  async signUp(data: CreateUserDto) {
    const user = await this.addUserInCache(data);

    if (user) {
      await this.mailService.addToQueue(data);
    }

    return user;
  }
}
