import { io } from '@app'
import { IGateway } from '@common/interfaces/gateway.interface'
import { ICustomServer, ICustomSocket } from '@common/interfaces/socket'

export class UsersGateway implements IGateway {
  readonly server: ICustomServer

  constructor() {
    this.server = io
  }

  init = (socket: ICustomSocket) => {
    this.handleConnect(socket)
  }

  handleConnect = async (socket: ICustomSocket) => {
    console.log(socket)
    //Add user to online set
  }

  handleDisconnect = async (socket: ICustomSocket) => {
    console.log(socket)
  }
}

export const usersGateway = new UsersGateway()
