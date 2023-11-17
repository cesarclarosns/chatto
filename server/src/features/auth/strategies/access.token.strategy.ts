import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { CONFIG_VALUES } from '@app/config/configuration'
import { TTokenPayload } from '@features/auth/auth.types'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>(
        CONFIG_VALUES.auth.jwtAccessSecret,
      ),
    })
  }

  validate(payload: TTokenPayload) {
    return payload
  }
}
