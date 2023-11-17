import { Injectable } from '@nestjs/common'
import { ICustomServer } from '@app/common/interfaces/socket.io'

@Injectable()
export class SocketService {
  public server: ICustomServer = null
}
