import { Injectable } from '@nestjs/common';

import { UserService } from '@/user/user.service';
import { MailService } from '@/mail/mail.service';

import { CreateUserDto } from '@/user/dto/create-query.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async signUp(data: CreateUserDto) {
    const user = await this.userService.createUser(data);

    if (user) {
      await this.mailService.addToQueue(data);
    }

    return user;
  }
}
