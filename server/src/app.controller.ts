import { Controller, Get } from '@nestjs/common'
import { AppService } from '@app/app.service'
import { SocketService } from '@common/modules/socket/socket.service'
import { Public } from '@features/auth/decorators/public.decorator'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private socketService: SocketService,
  ) {}

  @Get('health')
  @Public()
  async health() {
    const sockets = await this.socketService.server.fetchSockets()
    return sockets.map((socket) => ({
      rooms: Array.from(socket.rooms),
      socketId: socket.id,
    }))
  }
}
