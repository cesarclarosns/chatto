import { BadRequestResponseBodyDto } from '@common/dto/bad-request-reponse-body.dto';
import { UnauthorizedResponseBodyDto } from '@common/dto/unauthorized-reponse-body.dto';
import { UserDto } from '@features/users/dto/user.dto';
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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AUTH_COOKIES } from './auth.constants';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordCallbackDto } from './dto/reset-password-callback.dto';
import { ResetPasswordCallbackQueryDto } from './dto/reset-password-callback-query.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseBodyDto } from './dto/sign-in-response-body.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenGuard } from './guards';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description:
          'Set cookies: "refreshToken" (httpOnly) and "persist". The "refreshToken" cookie will be used to retrieve an accessToken and rotate the refreshToken. The "persist" cookie will be used by the client to identify if the user is logged in.',
      },
    },
    type: SignInResponseBodyDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponseBodyDto,
  })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponseBodyDto> {
    const tokens = await this.authService.signIn(signInDto);
    res.cookie(AUTH_COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      path: '/',
    });
    res.cookie(AUTH_COOKIES.PERSIST, true, { path: '/' });

    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: UserDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponseBodyDto,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('sign-out')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description: 'Clear cookies: "refreshToken" and "persist".',
      },
    },
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN, { httpOnly: true, path: '/' });
    res.clearCookie(AUTH_COOKIES.PERSIST, { path: '/' });

    return;
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return;
  }

  @Public()
  @Patch('reset-password/callback')
  @HttpCode(HttpStatus.OK)
  async resetPasswordCallback(
    @Body() resetPasswordCallbackDto: ResetPasswordCallbackDto,
    @Query() query: ResetPasswordCallbackQueryDto,
  ) {
    await this.authService.resetPasswordCallback(
      resetPasswordCallbackDto,
      query.token,
    );
    return;
  }

  @Public()
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiResponse({
    headers: {
      'Set-Cookie': {
        description:
          'Set cookies: "refreshToken" (httpOnly) and "persist". The "refreshToken" cookie will be used to retrieve an accessToken and rotate the refreshToken. The "persist" cookie will be used by the client to identify if the user is logged in.',
      },
    },
  })
  @ApiCookieAuth('refreshToken')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user_id = req.user.sub;

    const tokens = await this.authService.refreshTokens(user_id);

    res.cookie(AUTH_COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      path: '/',
    });
    res.cookie(AUTH_COOKIES.PERSIST, true, { path: '/' });

    return { accessToken: tokens.accessToken };
  }

  @Get('google-oauth')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  async googleOAuth() {}

  @Get('google-oauth/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleOAuthCallback() {}
}
