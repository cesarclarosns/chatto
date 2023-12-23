import { Module } from '@nestjs/common';

import { ChatsGateway } from './gateways/chats/chats.gateway';
import { NotificationsGateway } from './gateways/notifications/notifications.gateway';
import { RoomsGateway } from './gateways/rooms/rooms.gateway';
import { UsersGateway } from './gateways/users/users.gateway';

@Module({
  providers: [UsersGateway, RoomsGateway, ChatsGateway, NotificationsGateway],
})
export class SocketModule {}
