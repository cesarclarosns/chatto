import { Server, Socket } from 'socket.io'
import { TTokenPayload } from '@features/auth/auth.types'

export interface IDefaultCallbackResponse {
  status: 'success' | 'failed'
  message?: string | string[]
  errors?: { [key: string]: string | string[] }
}

export interface IClientToServerEvents {
  'chats/send-message': (
    ev: {
      chat_id: string
      message: undefined
    },
    cb: (response: IDefaultCallbackResponse) => void,
  ) => void

  'chats/user-typing': (
    ev: {
      chat_id: string
    },
    cb: (response: IDefaultCallbackResponse) => void,
  ) => void

  'chats/read-message': (
    ev: {
      chat_id: string
      message_id: string
    },
    cb: (response: IDefaultCallbackResponse) => void,
  ) => void

  'rooms/join-room': (
    ev: {
      room_id: string
    },
    cb: (response: IDefaultCallbackResponse) => void,
  ) => void

  'rooms/leave-room': (
    ev: {
      room_id: string
    },
    cb: (response: IDefaultCallbackResponse) => void,
  ) => void

  'rooms/send-message': (
    ev: {
      room_id: string
      content: string
    },
    cb: (response: IDefaultCallbackResponse) => void,
  ) => void

  'rooms/user-typing': (
    ev: {
      room_id: string
    },
    cb: (response: IDefaultCallbackResponse) => void,
  ) => void

  'users/get-status': (
    ev: { users: string[] },
    cb: (
      response: Omit<IDefaultCallbackResponse, 'payload'> & {
        payload: { online: string[]; offline: string[] }
      },
    ) => void,
  ) => void
}

export interface IServerToClientEvents {
  'chats/send-message': (ev: {
    chat_id: string
    user_id: string
    message: undefined
  }) => void

  'chats/user-typing': (ev: { chat_id: string; user_id: string }) => void

  'chats/read-message': (ev: {
    chat_id: string
    message_id: string
    user_id: string
  }) => void

  'rooms/join-room': (ev: { room_id: string; user_id: string }) => void

  'rooms/leave-room': (ev: { room_id: string; user_id: string }) => void

  'rooms/send-message': (ev: {
    room_id: string
    user_id: string
    content: string
  }) => void

  'rooms/user-typing': (ev: { room_id: string; user_id: string }) => void

  'users/get-status': (ev: { users: string[] }) => void

  'notifications/new-notification': (ev: { notification: undefined }) => void
}

export interface IInterServerEvents {}

export interface ISocketData extends TTokenPayload {}

export interface ICustomSocket
  extends Socket<
    IClientToServerEvents,
    IServerToClientEvents,
    IInterServerEvents,
    ISocketData
  > {}

export interface ICustomServer
  extends Server<
    IClientToServerEvents,
    IServerToClientEvents,
    IInterServerEvents,
    ISocketData
  > {}
