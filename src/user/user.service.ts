import { ConflictException, Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-query.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto) {
    const { email } = data;

    const emailExistence = await this.userRepository.findOne({
      filter: { email },
    });

    if (emailExistence)
      throw new ConflictException('User with email is already in use');

    const user = await this.userRepository.create({ data });

    return user;
  }
}
