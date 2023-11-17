import { Server } from 'socket.io'
import IClientToServerEvents from './client-to-server-events.interface'
import IInterServerEvents from './inter-server-events.interface'
import IServerToClientEvents from './server-to-client-events.interface'
import ISocketData from './socket-data.interface'

export default interface ICustomServer
  extends Server<
    IClientToServerEvents,
    IServerToClientEvents,
    IInterServerEvents,
    ISocketData
  > {}
