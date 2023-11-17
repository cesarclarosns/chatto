import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import {
  IClientToServerEvents,
  ICustomServer,
  ICustomSocket,
} from '@app/common/interfaces/socket.io'
import { GetStatusEventDto } from '@features/users/dto/get-status-event.dto'
import { UsersService } from '@features/users/users.service'

@WebSocketGateway()
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: ICustomServer

  constructor(private usersService: UsersService) {}

  handleDisconnect(socket: ICustomSocket) {
    console.log({ clientId: socket.id })
  }

  handleConnection(socket: ICustomSocket) {
    const userChannel = this.usersService.getUserChannel(socket.data.sub)
    socket.join(userChannel)
  }

  @SubscribeMessage<keyof IClientToServerEvents>('users/get-status')
  async handleMessage(
    @ConnectedSocket() socket: ICustomSocket,
    @MessageBody() ev: GetStatusEventDto,
  ): Promise<
    Parameters<Parameters<IClientToServerEvents['users/get-status']>[1]>[0]
  > {
    const offline = []
    const online = []

    await Promise.all(
      ev.userIds.map(async (userId) => {
        const userChannel = this.usersService.getUserChannel(userId)
        const sockets = await this.server.in(userChannel).fetchSockets()
        if (!sockets.length) return offline.push(userId)
        return online.push(userId)
      }),
    )

    return { payload: { offline, online }, status: 'success' }
  }

  @SubscribeMessage<keyof IClientToServerEvents>('users/heartbeat')
  async handleHearbeat(@ConnectedSocket() socket: ICustomSocket) {
    await this.usersService.update(socket.data.sub, {
      lastActive: new Date(Date.now()).toISOString(),
    })
  }
}
