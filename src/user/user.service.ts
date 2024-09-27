import { ConflictException, Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-query.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      filter: { email },
    });

    return user;
  }

  async findUserById(_id: string) {
    const user = await this.userRepository.findOne({ filter: { _id } });

    return user;
  }

  async createUser(data: CreateUserDto) {
    const { email } = data;

    const emailExistence = await this.findUserByEmail(email);

    if (emailExistence)
      throw new ConflictException('User with email is already in use');

    const user = await this.userRepository.create({ data });

    return user;
  }
}
