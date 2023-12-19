import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import { TTokenPayload } from './auth.types'
import { TUserDocument } from '../users/models/user.model'
import { CONFIG } from '@config'
import { signAsync, verifyAsync } from '@libs/jwt'
import { UsersService, usersService } from '@features/users/users.service'
import { HttpException } from '@common/classes/http-exception'
import { TSignUpDto } from './dto/sign-up.dto'
import { TSignInDto } from './dto/sign-in.dto'
import { TResetPasswordDto } from './dto/reset-password.dto'
import { TResetPasswordCallbackDto } from './dto/reset-password-callback.dto'

export class AuthService {
  private readonly usersService: UsersService

  constructor() {
    this.usersService = usersService
  }

  async signIn(
    signInDto: TSignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneByEmail(signInDto.email)
    if (!user) {
      throw new HttpException({
        errors: { email: 'Email is not registered' },
        message: 'Email is not registered',
        statusCode: StatusCodes.BAD_REQUEST,
      })
    }

    const passwordMatches = await bcrypt.compare(
      signInDto.password,
      user.password,
    )

    if (!passwordMatches) {
      throw new HttpException({
        errors: { password: 'Password is incorrect' },
        message: 'Password is incorrect',
        statusCode: StatusCodes.BAD_REQUEST,
      })
    }

    const tokens = await this.getTokens(user.id)
    return tokens
  }

  async signUp(signUpDto: TSignUpDto): Promise<TUserDocument> {
    const user = await this.usersService.findOne({
      $or: [{ email: signUpDto.email }, { username: signUpDto.username }],
    })
    if (user) {
      throw new HttpException({
        errors: {
          ...(user.email == signUpDto.email && {
            email: 'Email is already registered',
          }),
          ...(user.username == signUpDto.username && {
            username: 'Username is already taken',
          }),
        },
        statusCode: StatusCodes.BAD_REQUEST,
      })
    }

    const hashedPassword = await this.hashPassword(signUpDto.password)
    signUpDto.password = hashedPassword

    const userCreated = await this.usersService.create({ ...signUpDto })

    // const userRegisteredEvent = new UserRegisteredEvent({
    //   email: userCreated.email,
    // })

    // this.eventEmitter.emit(USERS_EVENTS.userRegistered, userRegisteredEvent)

    return userCreated
  }

  async refreshTokens(
    user_id: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.getTokens(user_id)
  }

  async getTokens(
    user_id: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.getTokenPayload(user_id)

    const [accessToken, refreshToken] = await Promise.all([
      signAsync(payload, CONFIG.auth.accessTokenSecret, {
        expiresIn: CONFIG.auth.accessTokenExpiresIn,
      }),
      signAsync(payload, CONFIG.auth.refreshTokenSecret, {
        expiresIn: CONFIG.auth.refreshTokenExpiresIn,
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async resetPassword(resetPasswordDto: TResetPasswordDto): Promise<void> {
    //create token
    const user = await this.usersService.findOneByEmail(resetPasswordDto.email)

    if (!user)
      throw new HttpException({
        errors: { email: 'Email is not registered' },
        message: 'Email is not registered',
        statusCode: StatusCodes.BAD_REQUEST,
      })

    const token = await this.getResetPasswordToken(user.id)

    //create password reset link
    const url = new URL('/auth/reset-password', CONFIG.app.appDomain)
    url.searchParams.set('token', token)

    // const resetPasswordLink = url.toString()

    // //send email
    // const resetPasswordEvent = new UserResetPasswordEvent({
    //   email: resetPasswordDto.email,
    //   resetPasswordLink,
    // })

    // this.eventEmitter.emit(USERS_EVENTS.userResetPassword, resetPasswordEvent)
  }

  async resetPasswordCallback(
    resetPasswordCallbackDto: TResetPasswordCallbackDto,
    token: string,
  ) {
    const payload = (await verifyAsync(
      token,
      CONFIG.auth.resetPasswordTokenSecret,
      {},
    )) as TTokenPayload

    const user = await this.usersService.findOneById(payload.sub)

    const hashedPassword = await this.hashPassword(
      resetPasswordCallbackDto.password,
    )

    return await this.usersService.update(user.id, {
      password: hashedPassword,
    })
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, CONFIG.auth.passwordSalt)
  }

  async getResetPasswordToken(user_id: string): Promise<string> {
    const payload = this.getTokenPayload(user_id)
    return await signAsync(payload, CONFIG.auth.resetPasswordTokenSecret, {})
  }

  getTokenPayload(user_id: string): TTokenPayload {
    return {
      sub: user_id,
    }
  }
}

export const authService = new AuthService()
