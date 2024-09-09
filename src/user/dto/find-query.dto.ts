import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-query.dto';

export class FindUserByEmailOrUserNameDto extends PartialType(
  PickType(CreateUserDto, ['email'] as const),
) {}
