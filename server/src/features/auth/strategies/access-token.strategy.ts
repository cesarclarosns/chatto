import { CONFIG_VALUES } from '@config/configuration';
import { TTokenPayload } from '@features/auth/auth.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AUTH_STRATEGIES } from '../auth.constants';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.accessToken,
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>(
        CONFIG_VALUES.AUTH.JWT_ACCESS_SECRET,
      ),
    });
  }

  validate(payload: TTokenPayload) {
    return payload;
  }
}
