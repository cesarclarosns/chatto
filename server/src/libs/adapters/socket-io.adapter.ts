import { INestApplicationContext } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { Server, ServerOptions } from 'socket.io'
import { CONFIG_VALUES } from '@app/config/configuration'
import { socketAuthMiddleware } from '@libs/middlewares/socket-auth.middleware'

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app)
  }

  createIOServer(port: number, options?: ServerOptions): any {
    // Set up
    options.path = this.configService.getOrThrow<string>(
      CONFIG_VALUES.app.gatewayPath,
    )
    const server = super.createIOServer(port, options) as Server

    // Add middlewares
    server.use(socketAuthMiddleware(this.configService))

    return server
  }
}
