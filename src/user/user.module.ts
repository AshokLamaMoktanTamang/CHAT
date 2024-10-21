import * as crypto from 'crypto';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { BcryptModule } from '@/bcrypt/bcrypt.module';
import { BcryptService } from '@/bcrypt/bcrypt.service';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        imports: [BcryptModule],
        inject: [BcryptService],
        useFactory: (bcryptService: BcryptService) => {
          const schema = UserSchema;
          schema.pre<User>('save', async function () {
            if (!this?.avatarUrl) {
              const md5 = crypto
                .createHash('md5')
                .update(this.email)
                .digest('hex');

              this.avatarUrl = `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
            }

            if (this.password) {
              this.password = await bcryptService.hash(this.password);
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
