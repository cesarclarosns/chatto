import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { JsonWebTokenError } from 'jsonwebtoken'
import { CONFIG_VALUES } from '@app/config/configuration'
import { TTokenPayload } from '@features/auth/auth.types'
import { ResetPasswordDto } from '@features/auth/dto/reset-password.dto'
import { ResetPasswordCallbackDto } from '@features/auth/dto/reset-password-callback.dto'
import { SignInDto } from '@features/auth/dto/sign-in.dto'
import { SignUpDto } from '@features/auth/dto/sign-up.dto'
import {
  UserRegisteredEvent,
  UserResetPasswordEvent,
  USERS_EVENTS,
} from '@features/users/events'
import { UserDocument } from '@features/users/schemas/user.schema'
import { UsersService } from '@features/users/users.service'

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
    const user = await this.usersService.findOneByEmail(signInDto.email)
    if (!user) {
      throw new HttpException(
        {
          errors: { email: 'Email is not registered.' },
          message: 'Email is not registered.',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const passwordMatches = await bcrypt.compare(
      signInDto.password,
      user.password,
    )
    if (!passwordMatches) {
      throw new HttpException(
        {
          errors: { password: 'Password is incorrect.' },
          message: 'Password is incorrect.',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const tokens = await this.getTokens({ email: user.email, userId: user.id })
    return tokens
  }

  async signUp(signUpDto: SignUpDto): Promise<UserDocument> {
    const user = await this.usersService.findOneByEmail(signUpDto.email)
    if (user) {
      throw new HttpException(
        {
          errors: { email: 'Email is already registered.' },
          message: 'Email is already registered.',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const hashedPassword = await this.hashData(signUpDto.password)
    signUpDto.password = hashedPassword

    const userCreated = await this.usersService.create({ ...signUpDto })

    const userRegisteredEvent = new UserRegisteredEvent({
      email: userCreated.email,
    })

    this.eventEmitter.emit(USERS_EVENTS.userRegistered, userRegisteredEvent)

    return userCreated
  }

  async refreshTokens({
    email,
    userId,
  }: {
    userId: string
    email: string
  }): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.getTokens({
      email,
      userId,
    })
  }

  async getTokens({
    email,
    userId,
  }: {
    userId: string
    email: string
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.getTokenPayload({ email, userId })

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtAccessExpiresIn,
        ),
        secret: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtAccessSecret,
        ),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtRefreshExpiresIn,
        ),
        secret: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtRefreshSecret,
        ),
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    // Create token
    const user = await this.usersService.findOneByEmail(resetPasswordDto.email)
    if (!user)
      throw new HttpException(
        {
          errors: { email: 'Email is not registered.' },
          message: 'Email is not registered.',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      )

    const token = await this.getPasswordResetToken({
      email: resetPasswordDto.email,
      userId: user.id,
    })

    // Create password reset link
    const url = new URL(
      'reset/password',
      this.configService.getOrThrow<string>(CONFIG_VALUES.app.appDomain),
    )
    url.searchParams.set('token', token)

    const resetPasswordLink = url.toString()
    console.log({ resetPasswordDto })

    // Send email
    const resetPasswordEvent = new UserResetPasswordEvent({
      email: resetPasswordDto.email,
      resetPasswordLink,
    })

    this.eventEmitter.emit(USERS_EVENTS.userResetPassword, resetPasswordEvent)
  }

  async resetPasswordCallback(
    resetPasswordCallbackDto: ResetPasswordCallbackDto,
    token: string,
  ) {
    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtResetPasswordSecret,
        ),
      })) as TTokenPayload

      const user = await this.usersService.findOneByEmail(payload.email)

      const hashedPassword = await this.hashData(
        resetPasswordCallbackDto.password,
      )

      return await this.usersService.update(user.id, {
        password: hashedPassword,
      })
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED)
      }
      throw err
    }
  }

  async getPasswordResetToken({
    email,
    userId,
  }: {
    userId: string
    email: string
  }): Promise<string> {
    const payload = this.getTokenPayload({ email, userId })
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>(
        CONFIG_VALUES.auth.jwtResetPasswordExpiresIn,
      ),
      secret: this.configService.getOrThrow<string>(
        CONFIG_VALUES.auth.jwtResetPasswordSecret,
      ),
    })
    return token
  }

  getTokenPayload({
    email,
    userId,
  }: {
    userId: string
    email: string
  }): TTokenPayload {
    return {
      email,
      sub: userId,
    }
  }

  async hashData(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(data, salt)
  }
}
