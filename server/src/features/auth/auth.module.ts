import { UsersModule } from '@features/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccessTokenGuard,
  GoogleOAuthGuard,
  RefreshTokenGuard,
} from './guards';
import {
  AccessTokenStrategy,
  GoogleOAuthStrategy,
  RefreshTokenStrategy,
} from './strategies';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule, UsersModule, JwtModule.register({})],
  providers: [
    AuthService,
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenStrategy,
    RefreshTokenGuard,
    GoogleOAuthStrategy,
    GoogleOAuthGuard,
  ],
})
export class AuthModule {}
