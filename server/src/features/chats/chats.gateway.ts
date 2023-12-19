import { Socket } from 'socket.io'

export class ChatsGateway {
  private readonly chatsService: undefined

  constructor() {
    this.chatsService = undefined
  }

  init(socket: Socket) {
    console.log('ChatsGateway init', socket.id)

    socket.on('connection', () => {
      console.log('ChatsGateway connection', socket.id)
    })
  }
}

export const chatsGateway = new ChatsGateway()
