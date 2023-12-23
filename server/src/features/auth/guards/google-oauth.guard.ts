import { CONFIG_VALUES } from '@config/configuration';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_STRATEGIES } from '../auth.constants';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard(AUTH_STRATEGIES.googleOAuth) {
  constructor(configService: ConfigService) {
    super({
      accessType: 'offline',
      failureRedirect: configService.getOrThrow<string>(
        CONFIG_VALUES.APP.APP_DOMAIN,
      ),
      prompt: 'select_account',
    });
  }
}
