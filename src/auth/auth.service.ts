import { Types } from 'mongoose';
import {
  Logger,
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@/user/user.service';
import { MailService } from '@/mail/mail.service';
import { BcryptService } from '@/bcrypt/bcrypt.service';
import { RedisService } from '@/database/redis/redis.service';

import { User } from '@/user/schema/user.schema';
import {
  IForgotPassword,
  IResetPassword,
  ISetPassword,
  ISignIn,
  ISignUp,
} from './dto/auth.interfaces';
import { generateNumericOTP } from '@/utils/generateNumericOtp';

const CACHE_USER_TTL = 6 * 60 * 60;
const USER_OTP_TTL = 5 * 60;

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

    await this.mailService.addToQueue('signup', {
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

  async forgotPassword({ email }: IForgotPassword) {
    const message = 'If user with email exist you will recieve email';

    const user = await this.userService.findUserByEmail(email);

    if (!user) return message;

    const otp = generateNumericOTP(6);

    await Promise.all([
      this.mailService.addToQueue('verifyOtp', { email: user.email, otp }),
      this.redisService.set(`${email}:otp`, USER_OTP_TTL),
    ]);

    return message;
  }

  async resetPassword({ email, otp, password }: IResetPassword) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const redisOtpKey = `${user.email}:otp`
    const userOtp = await this.redisService.get(redisOtpKey);

    if (userOtp !== otp.toString())
      throw new BadRequestException('Failed to reset password');

    const [accessToken] = await Promise.all([
      this.generateAccessToken(user.toObject()),
      this.userService.updatePassowrdById(user._id.toString(), password),
      this.redisService.delete(redisOtpKey)
    ]);

    return { accessToken };
  }
}
