import { io } from '@app'
import { ICustomServer, ICustomSocket } from '@common/interfaces/socket'

export class NotificationsGateway {
  private readonly server: ICustomServer

  constructor() {
    this.server = io
  }

  init(socket: ICustomSocket) {
    socket.on('disconnect', (reason, des) => {
      console.log(`Notifications disconnect: ${socket.id}`, reason, des)
    })
  }

  sendNotification(notificationDto: undefined) {
    console.log(notificationDto)
  }
}

export const notificationsGateway = new NotificationsGateway()
