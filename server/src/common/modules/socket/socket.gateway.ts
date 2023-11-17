import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { ICustomServer } from '@app/common/interfaces/socket.io'
import { SocketService } from './socket.service'

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer() server: ICustomServer

  constructor(private socketService: SocketService) {}

  afterInit(server: ICustomServer) {
    this.socketService.server = server
  }
}
