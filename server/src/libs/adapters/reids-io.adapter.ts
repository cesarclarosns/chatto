import { TRedisClientOptions } from '@common/types/redis';
import { CONFIG_VALUES } from '@config/configuration';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const redisClientOptions: TRedisClientOptions = {
      url: this.configService.getOrThrow<string>(CONFIG_VALUES.CACHE.URL),
    };

    const pubClient = createClient(redisClientOptions);
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    port = this.configService.getOrThrow<number>(
      CONFIG_VALUES.APP.LISTENING_PORT,
    );

    const allowedOrigins = this.configService
      .getOrThrow<string>(CONFIG_VALUES.CORS.ALLOWED_ORIGINS)
      .split(',');
    options.cors = { credentials: true, origin: allowedOrigins };

    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
