import mongoose from 'mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ConfigService } from '@nestjs/config';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { User, UserSchema } from '../user/schema/user.schema';

dotenv.config();

@Injectable()
export class UserSeeder {
  private userModel: Model<User>;

  constructor(private bcryptService: BcryptService) {
    this.userModel = mongoose.model(User.name, UserSchema);
  }

  async seed() {
    console.log('Seeding users...');
    const users = [];

    for (let i = 0; i < 50; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const password = await this.bcryptService.hash('password'); // default password for all users
      const bio = faker.lorem.sentence();

      const md5 = crypto.createHash('md5').update(email).digest('hex');
      const avatarUrl = `https://gravatar.com/avatar/${md5}?s=200&d=retro`;

      users.push({
        firstName,
        lastName,
        email,
        password,
        avatarUrl,
        bio,
      });
    }

    await this.userModel.insertMany(users);
    console.log('50 users have been generated!');
  }
}

(async () => {
  mongoose.connect(process.env.MONGO_URI);

  const bcryptService = new BcryptService();
  const userSeeder = new UserSeeder(bcryptService);
  await userSeeder.seed();

  mongoose.connection.close();
})();
