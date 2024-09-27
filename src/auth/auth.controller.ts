import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { SetPasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Post('set-password')
  async setPassword(@Body() data: SetPasswordDto) {
    return this.authService.setPassword(data);
  }

  @Post('sign-in')
  async signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data);
  }
}
