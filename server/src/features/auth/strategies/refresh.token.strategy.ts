import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { CONFIG_VALUES } from '@app/config/configuration'
import { TTokenPayload } from '@features/auth/auth.types'
import { COOKIES } from '../auth.constants'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      passReqToCallback: true,
      secretOrKey: configService.getOrThrow<string>(
        CONFIG_VALUES.auth.jwtRefreshSecret,
      ),
    })
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      COOKIES.REFRESH_TOKEN in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies[COOKIES.REFRESH_TOKEN]
    }

    return null
  }

  validate(req: Request, payload: TTokenPayload) {
    return payload
  }
}
