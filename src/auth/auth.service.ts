import { Types } from 'mongoose';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@/user/user.service';
import { MailService } from '@/mail/mail.service';
import { BcryptService } from '@/bcrypt/bcrypt.service';
import { RedisService } from '@/database/redis/redis.service';

import { User } from '@/user/schema/user.schema';
import { ISetPassword, ISignIn, ISignUp } from './dto/auth.interfaces';

const CACHE_USER_TTL = 6 * 60 * 60;
const TOKEN_LENGTH = 16;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly bcryptService: BcryptService,
  ) {}

  private async addUserInCache(data: ISignUp) {
    const { email } = data;

    const [existingCacheUser, existingUser] = await Promise.all([
      this.redisService.get(`${email}:signup:unverified`),
      this.userService.findUserByEmail(email),
    ]);

    if (existingUser || existingCacheUser) {
      this.logger.warn(`Attempt to register with existing email: ${email}`);
      throw new ConflictException('User with this email already exists');
    }

    const userId = new Types.ObjectId();

    const user = {
      _id: userId,
      ...data,
    };

    await this.redisService.set(
      `${email}:signup:unverified`,
      JSON.stringify(user),
      CACHE_USER_TTL,
    );

    return user;
  }

  private async generateAccessToken(user: User) {
    return await this.jwtService.signAsync(user, { expiresIn: '8h' });
  }

  async signUp(data: ISignUp) {
    const user = await this.addUserInCache(data);

    if (!user) {
      this.logger.error(`Failed to cache user during signup: ${data.email}`);
      throw new InternalServerErrorException('Failed to register user');
    }

    const { email, _id } = user;
    const verificationToken = await this.jwtService.signAsync(user);

    await this.mailService.addToQueue({
      email,
      cypherString: verificationToken,
      userId: _id,
    });

    this.logger.log(`User signup initiated for ${email}`);
    return user;
  }

  async setPassword(data: ISetPassword) {
    const { userId, password, token } = data;

    const { _id, email } = this.jwtService.decode(token) || {};

    if (userId.toString() !== _id?.toString())
      throw new UnauthorizedException('Failed to validate token');

    const redisUserKey = `${email}:signup:unverified`;
    const user = await this.redisService.get(redisUserKey);

    if (!user) {
      this.logger.warn(
        `Token validation failed for ${userId} (User or token not found)`,
      );
      throw new NotFoundException(
        'The token might have expired or already used',
      );
    }

    const [newUser] = await Promise.all([
      this.userService.createUser({ password, ...JSON.parse(user) }),
      this.redisService.delete(redisUserKey),
    ]);

    this.logger.log(`User successfully verified and created: ${userId}`);

    const accessToken = await this.generateAccessToken(newUser.toObject());

    return { accessToken };
  }

  async signIn({ email, password }: ISignIn) {
    const errorMessage = 'Invalid credential!';

    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException(errorMessage);

    const isPasswordValid = await this.bcryptService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) throw new UnauthorizedException(errorMessage);

    const accessToken = await this.generateAccessToken(user.toObject());

    return { accessToken };
  }
}
