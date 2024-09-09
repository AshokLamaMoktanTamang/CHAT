import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserService } from '@/user/user.service';

import { CreateUserDto } from '@/user/dto/create-query.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signUp(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }
}
