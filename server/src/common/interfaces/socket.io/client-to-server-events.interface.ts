import { FindRoomEventDto } from '@app/features/rooms/dto/find-room-event.dto'
import { GetStatusEventDto } from '@app/features/rooms/dto/get-status-event.dto'
import { LeaveRoomEventDto } from '@app/features/rooms/dto/leave-room-event.dto'
import { NewMessageEventDto } from '@app/features/rooms/dto/new-message-event.dto'
import { UserTypingClientEventDto } from '@app/features/rooms/dto/user-typing-event.dto'
import { RoomStatusEnum } from '@app/features/rooms/enums/room-status.enum'
import { RoomDocument } from '@app/features/rooms/schemas/room.schema'
import IDefaultCallbackResponse from './default-callback-response.interface'

export default interface IClientToServerEvents {
  'chats/new-message': (
    ev: {
      chatId: string
      message: any
    },
    cb: (res?: IDefaultCallbackResponse) => void,
  ) => void

  'chats/chat/join-chat': (
    ev: { chatId: string },
    cb: (res?: IDefaultCallbackResponse) => void,
  ) => void

  'chats/chat/leave-chat': (
    ev: { chatId: string },
    cb: (res?: IDefaultCallbackResponse) => void,
  ) => void

  'chats/chat/new-message': (
    ev: any,
    cb: (res?: IDefaultCallbackResponse) => void,
  ) => void

  'chats/chat/user-typing': (
    ev: {
      chatId: string
      userId: string
    },
    cb: (res?: IDefaultCallbackResponse) => void,
  ) => void

  'chats/chat/read-message': (
    ev: {
      messageId: string
      chatId: string
      userId: string
    },
    cb: (res?: IDefaultCallbackResponse) => void,
  ) => void

  'users/heartbeat': () => void

  'users/get-status': (
    ev: GetStatusEventDto,
    cb: (
      res?: Omit<IDefaultCallbackResponse, 'payload'> & {
        payload?: { online: string[]; offline: string[] }
      },
    ) => void,
  ) => void

  'rooms/room/find-room': (
    ev: FindRoomEventDto,
    cb: (
      res?: Omit<IDefaultCallbackResponse, 'payload'> & {
        payload: { room: RoomDocument; token: string }
      },
    ) => void,
  ) => void

  'rooms/room/leave-room': (ev: LeaveRoomEventDto) => void

  'rooms/room/user-typing': (ev: UserTypingClientEventDto) => void

  'rooms/room/new-message': (ev: NewMessageEventDto) => void

  'rooms/room/get-status': (
    ev: GetStatusEventDto,
    cb: (
      res?: Omit<IDefaultCallbackResponse, 'payload'> & {
        payload: { status: RoomStatusEnum }
      },
    ) => void,
  ) => void
}
