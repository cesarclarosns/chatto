import { ICustomServer, ICustomSocket } from './socket'

export interface IGateway {
  readonly server: ICustomServer

  init: (socket: ICustomSocket) => void
}
