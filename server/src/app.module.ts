// import { TRedisClientOptions } from '@common/types/redis';
import configuration, {
  CONFIG_VALUES,
  configValidationSchema,
} from '@config/configuration';
import { AttachmentsModule } from '@features/attachments/attachments.module';
import { AuthModule } from '@features/auth/auth.module';
import { AccessTokenGuard } from '@features/auth/guards';
import { EmailModule } from '@features/email/email.module';
import { FollowersModule } from '@features/followers/followers.module';
import { HealthModule } from '@features/health/health.module';
import { NotificationsModule } from '@features/notifications/notifications.module';
import { PaymentsModule } from '@features/payments/payments.module';
import { PostsModule } from '@features/posts/posts.module';
import { RoomsModule } from '@features/rooms/rooms.module';
import { SocketModule } from '@features/socket/socket.module';
import { SubscriptionsModule } from '@features/subscriptions/subscriptions.module';
import { UsersModule } from '@features/users/users.module';
// import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  APP_GUARD,
  // APP_INTERCEPTOR
} from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

// import redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './features/chats/chats.module';
import { UserRatingsModule } from './features/user-ratings/user-ratings.module';

@Module({
  controllers: [AppController],
  imports: [
    // CacheModule.registerAsync<TRedisClientOptions>({
    //   useFactory: (configService: ConfigService) => ({
    //     store: redisStore,
    //     url: configService.getOrThrow<string>(CONFIG_VALUES.cache.url),
    //   }),
    // }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
      validationSchema: configValidationSchema,
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
            CONFIG_VALUES.THROTTLER.LIMIT,
          ),
          ttl: configService.getOrThrow<number>(CONFIG_VALUES.THROTTLER.TTL),
        },
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow<string>(
          CONFIG_VALUES.DATABASE.URI,
        );
        return { uri };
      },
    }),
    AuthModule,
    AttachmentsModule,
    NotificationsModule,
    UsersModule,
    EmailModule,
    FollowersModule,
    HealthModule,
    PaymentsModule,
    PostsModule,
    RoomsModule,
    SubscriptionsModule,
    SocketModule,
    UserRatingsModule,
    ChatsModule,
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    // { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule {}
