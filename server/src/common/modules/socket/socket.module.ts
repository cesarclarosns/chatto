import { Global, Module } from '@nestjs/common'
import { SocketGateway } from './socket.gateway'
import { SocketService } from './socket.service'

@Global()
@Module({
  controllers: [],
  exports: [SocketService],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
