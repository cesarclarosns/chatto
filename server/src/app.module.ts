import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerModule } from '@nestjs/throttler'
import { AppController } from '@app/app.controller'
import { AppService } from '@app/app.service'
import config, {
  CONFIG_VALUES,
  configValidationSchema,
} from '@app/config/configuration'
import { AuthModule } from '@app/features/auth/auth.module'
import { ChatsModule } from '@app/features/chats/chats.module'
import { RoomsModule } from '@app/features/rooms/rooms.module'
import { SubscriptionsModule } from '@app/features/subscriptions/subscriptions.module'
import { UsersModule } from '@app/features/users/users.module'
import { SocketModule } from '@common/modules/socket/socket.module'
import { AccessTokenGuard } from '@features/auth/guards'

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config],
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>(CONFIG_VALUES.database.uri),
      }),
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      ignoreErrors: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      wildcard: false,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          limit: configService.getOrThrow<number>(
            CONFIG_VALUES.throttler.limit,
          ),
          ttl: configService.getOrThrow<number>(CONFIG_VALUES.throttler.ttl),
        },
      ],
    }),
    AuthModule,
    UsersModule,
    ChatsModule,
    SubscriptionsModule,
    RoomsModule,
    SocketModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
