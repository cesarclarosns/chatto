import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { COOKIES } from '@features/auth/auth.constants'
import { AuthService } from '@features/auth/auth.service'
import { ResetPasswordDto } from '@features/auth/dto/reset-password.dto'
import { ResetPasswordCallbackDto } from '@features/auth/dto/reset-password-callback.dto'
import { ResetPasswordCallbackQueryDto } from '@features/auth/dto/reset-password-callback-query.dto'
import { SignInDto } from '@features/auth/dto/sign-in.dto'
import { SignUpDto } from '@features/auth/dto/sign-up.dto'
import { AccessTokenGuard, RefreshTokenGuard } from '@features/auth/guards'
import { Public } from './decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(signInDto)
    res.cookie(COOKIES.REFRESH_TOKEN, tokens.refreshToken, { httpOnly: true })

    return { accessToken: tokens.accessToken }
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIES.REFRESH_TOKEN, { httpOnly: true })
    return {}
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto)
    return
  }

  @Public()
  @Patch('reset-password/callback')
  @HttpCode(HttpStatus.OK)
  async resetPasswordCallback(
    @Body() resetPasswordCallbackDto: ResetPasswordCallbackDto,
    @Query() query: ResetPasswordCallbackQueryDto,
  ) {
    return await this.authService.resetPasswordCallback(
      resetPasswordCallbackDto,
      query.token,
    )
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.sub
    const email = req.user.email

    const tokens = await this.authService.refreshTokens({ email, userId })

    res.cookie(COOKIES.REFRESH_TOKEN, tokens.refreshToken, { httpOnly: true })

    return { accessToken: tokens.accessToken }
  }

  @Public()
  @Get('google')
  async google() {}

  @Public()
  @Get('google/callback')
  async googleCallback() {}
}
