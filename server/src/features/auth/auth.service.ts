import { CONFIG_VALUES } from '@config/configuration';
import { TTokenPayload } from '@features/auth/auth.types';
import { User } from '@features/users/entities/user.entity';
import { UsersService } from '@features/users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';

import { AUTH_EVENTS } from './auth.constants';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordCallbackDto } from './dto/reset-password-callback.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ResetPasswordEvent } from './events/reset-password.event';
import { SignUpEvent } from './events/sign-up.event';

@Injectable()
export class AuthService {
  constructor(
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new HttpException(
        {
          errors: { email: 'Email is not registered' },
          message: 'Email is not registered',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatches = await argon2.verify(
      user.password,
      signInDto.password,
    );
    if (!passwordMatches) {
      throw new HttpException(
        {
          errors: { password: 'Password is incorrect' },
          message: 'Password is incorrect',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.getTokens(user.id);
    return tokens;
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const user = await this.usersService.findOne({
      $or: [{ email: signUpDto.email }, { username: signUpDto.username }],
    });
    if (user) {
      throw new HttpException(
        {
          errors: {
            ...(user.email == signUpDto.email && {
              email: 'Email is already registered',
            }),
            ...(user.username == signUpDto.username && {
              email: 'Username is already taken',
            }),
          },
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashData(signUpDto.password);
    signUpDto.password = hashedPassword;

    const userCreated = await this.usersService.create({ ...signUpDto });

    // Emit event
    const signUpEvent = new SignUpEvent({ email: userCreated.email });
    this.eventEmitter.emit(AUTH_EVENTS.signUp, signUpEvent);

    return userCreated;
  }

  async refreshTokens(
    user_id: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.getTokens(user_id);
  }

  async getTokens(
    user_id: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.getTokenPayload(user_id);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.getOrThrow<string>(
          CONFIG_VALUES.AUTH.JWT_ACCESS_EXPIRES_IN,
        ),
        secret: this.configService.getOrThrow<string>(
          CONFIG_VALUES.AUTH.JWT_ACCESS_SECRET,
        ),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.getOrThrow<string>(
          CONFIG_VALUES.AUTH.JWT_REFRESH_EXPIRES_IN,
        ),
        secret: this.configService.getOrThrow<string>(
          CONFIG_VALUES.AUTH.JWT_REFRESH_SECRET,
        ),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    // Create token
    const user = await this.usersService.findOneByEmail(resetPasswordDto.email);

    if (!user)
      throw new HttpException(
        {
          errors: { email: 'Email is not registered' },
          message: 'Email is not registered',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const token = await this.getPasswordResetToken(user.id);

    // Create password reset link
    const url = new URL(
      '/auth/reset-password',
      this.configService.getOrThrow<string>(CONFIG_VALUES.APP.APP_DOMAIN),
    );
    url.searchParams.set('token', token);

    const resetPasswordLink = url.toString();

    // Emit event
    const resetPasswordEvent = new ResetPasswordEvent({
      email: resetPasswordDto.email,
      resetPasswordLink,
    });
    this.eventEmitter.emit(AUTH_EVENTS.resetPassword, resetPasswordEvent);
  }

  async resetPasswordCallback(
    resetPasswordCallbackDto: ResetPasswordCallbackDto,
    token: string,
  ) {
    let payload: TTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>(
          CONFIG_VALUES.AUTH.JWT_RESET_PASSWORD_SECRET,
        ),
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersService.findOneById(payload.sub);

    const hashedPassword = await this.hashData(
      resetPasswordCallbackDto.password,
    );

    return await this.usersService.update(user.id, {
      password: hashedPassword,
    });
  }

  async getPasswordResetToken(user_id: string): Promise<string> {
    const payload = this.getTokenPayload(user_id);
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>(
        CONFIG_VALUES.AUTH.JWT_RESET_PASSWORD_EXPIRES_IN,
      ),
      secret: this.configService.getOrThrow<string>(
        CONFIG_VALUES.AUTH.JWT_RESET_PASSWORD_SECRET,
      ),
    });
    return token;
  }

  getTokenPayload(user_id: string): TTokenPayload {
    return {
      sub: user_id,
    };
  }

  async hashData(data: string | Buffer): Promise<string> {
    return await argon2.hash(data);
  }
}
