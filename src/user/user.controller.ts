import { Controller, Get, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { User as UserData } from './schema/user.schema';

import { AuthGuard } from '@/common/guard/auth.gaurd';
import { User } from '@/common/decorator/userParamDecorator';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserProfile(
    @User() { firstName, lastName, middleName, email, avatarUrl }: UserData,
  ) {
    const newUser = {
      fullName: `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`,
      email,
      avatarUrl,
    };
    
    return newUser;
  }
}
