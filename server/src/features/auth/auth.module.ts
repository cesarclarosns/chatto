import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
// import { JwtModule } from '@nestjs/jwt'
import { AuthController } from '@features/auth/auth.controller'
import { AuthService } from '@features/auth/auth.service'
import { AccessTokenGuard, RefreshTokenGuard } from '@features/auth/guards'
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '@features/auth/strategies'
import { UsersModule } from '@features/users/users.module'

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [ConfigModule, UsersModule, JwtModule.register({})],
  providers: [
    AuthService,
    AccessTokenGuard,
    AccessTokenStrategy,
    RefreshTokenGuard,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
