import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { CreateUserDto } from '@/user/dto/create-query.dto';

export class SignUpDto extends OmitType(CreateUserDto, ['password'] as const) {}

export class SetPasswordDto extends PickType(CreateUserDto, [
  'password',
] as const) {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsString()
  token: string;
}

export class SignInDto extends PickType(CreateUserDto, ['email', 'password']) {}

export class ForgotPasswordDto extends PickType(CreateUserDto, ['email']) {}

export class ResetPasswordDto extends PickType(CreateUserDto, ['email', 'password']) {
  @IsNumber()
  otp: number
}
