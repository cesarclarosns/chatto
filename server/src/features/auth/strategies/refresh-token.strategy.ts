import { CONFIG_VALUES } from '@config/configuration';
import { TTokenPayload } from '@features/auth/auth.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH_COOKIES, AUTH_STRATEGIES } from '../auth.constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.refreshToken,
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      passReqToCallback: true,
      secretOrKey: configService.getOrThrow<string>(
        CONFIG_VALUES.AUTH.JWT_REFRESH_SECRET,
      ),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      AUTH_COOKIES.REFRESH_TOKEN in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies[AUTH_COOKIES.REFRESH_TOKEN];
    }

    return null;
  }

  validate(req: Request, payload: TTokenPayload) {
    return payload;
  }
}
