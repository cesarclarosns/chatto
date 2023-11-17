import { LeaveRoomEventDto } from '@app/features/rooms/dto/leave-room-event.dto'
import { NewMessageEventDto } from '@app/features/rooms/dto/new-message-event.dto'
import { UserTypingServerEventDto } from '@app/features/rooms/dto/user-typing-event.dto'

export default interface IServerToClientEvents {
  'chats/new-message': (ev: { chatId: string; message: any }) => void

  'chats/chat/new-message': (ev: { chatId: string; message: any }) => void

  'chats/chat/user-typing': (ev: { chatId: string; userId: string }) => void

  'rooms/room/leave-room': (ev: LeaveRoomEventDto) => void

  'rooms/room/new-message': (ev: NewMessageEventDto) => void

  'rooms/room/user-typing': (ev: UserTypingServerEventDto) => void
}
