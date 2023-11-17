import IClientToServerEvents from '@common/interfaces/socket.io/client-to-server-events.interface'
import IDefaultCallbackResponse from '@common/interfaces/socket.io/default-callback-response.interface'
import IInterServerEvents from '@common/interfaces/socket.io/inter-server-events.interface'
import IServerToClientEvents from '@common/interfaces/socket.io/server-to-client-events.interface'
import ISocketData from '@common/interfaces/socket.io/socket-data.interface'
import ICustomServer from './custom-server.interface'
import ICustomSocket from './custom-socket.interface'

export {
  IClientToServerEvents,
  ICustomServer,
  ICustomSocket,
  IDefaultCallbackResponse,
  IInterServerEvents,
  IServerToClientEvents,
  ISocketData,
}
