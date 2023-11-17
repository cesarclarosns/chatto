import { Socket } from 'socket.io'
import IClientToServerEvents from './client-to-server-events.interface'
import IInterServerEvents from './inter-server-events.interface'
import IServerToClientEvents from './server-to-client-events.interface'
import ISocketData from './socket-data.interface'

export default interface ICustomSocket
  extends Socket<
    IClientToServerEvents,
    IServerToClientEvents,
    IInterServerEvents,
    ISocketData
  > {}

// const socket = {} as ICustomSocket
// socket.on('users/get-status', (payload, cb) => {
//   console.log({ payload })
//   cb({ payload: {} })
// })
