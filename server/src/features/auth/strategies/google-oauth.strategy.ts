import { CONFIG_VALUES } from '@config/configuration';
import { CreateUserDto } from '@features/users/dto/create-user.dto';
import { UsersService } from '@features/users/users.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import mongoose from 'mongoose';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AUTH_STRATEGIES } from '../auth.constants';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.googleOAuth,
) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      callbackURL: configService.getOrThrow<string>(
        CONFIG_VALUES.AUTH.GOOGLE_CALLBACK_URL,
      ),
      clientID: configService.getOrThrow<string>(
        CONFIG_VALUES.AUTH.GOOGLE_CLIENT_ID,
      ),
      clientSecret: configService.getOrThrow<string>(
        CONFIG_VALUES.AUTH.GOOGLE_CLIENT_SECRET,
      ),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      let user = await this.usersService.findOneByGoogleId(profile.id);

      if (!user) {
        const _id = new mongoose.Types.ObjectId().toString();
        const username = `u${_id}`;
        const google_id = profile.id;
        const profilePicture = profile.photos?.[0].value;
        const displayName = profile.displayName;

        const createUserDto = plainToInstance(CreateUserDto, {
          _id,
          google_id,
          profile: {
            ...(displayName && { displayName: profile.displayName }),
            ...(profilePicture && {
              profilePicture: profile.photos?.[0].value,
            }),
          },
          username,
        });

        const errors = await validate(createUserDto);
        if (errors.length) throw errors;

        user = await this.usersService.create(createUserDto);
      }
      const payload = this.authService.getTokenPayload(user.id);
      done(null, payload);
    } catch (err) {
      done(err, null);
    }
  }
}
