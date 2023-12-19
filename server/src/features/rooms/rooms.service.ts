import { CONFIG } from '@config'
import { TCreateRoomDto } from './dto/create-room.dto'
import { TFindAllRoomsDto } from './dto/find-all-rooms.dto'
import { TUpdateRoomDto } from './dto/update-room.dto'
import { roomModel } from './models/room.model'
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk'
import { roomMessageModel } from './models/room-message'
import { TCreateRoomMessageDto } from './dto/create-room-message.dto'
import { TCreateRoomTokenDto } from './dto/create-room-token.dto'
import { TFindAllRoomMessagesDto } from './dto/find-all-room-messages.dto'

/**
 * TODO:
 * - do something to clean up rooms that go empty after too much inactivity
 */

//FIXME:

export class RoomsService {
  private readonly roomModel: typeof roomModel
  private readonly roomMessageModel: typeof roomMessageModel
  private readonly roomServiceClient: RoomServiceClient

  constructor() {
    this.roomModel = roomModel
    this.roomServiceClient = new RoomServiceClient(
      CONFIG.app.livekitHost,
      CONFIG.app.livekitApiKey,
      CONFIG.app.livekitSecretKey,
    )
  }

  async findOne(id: string) {
    return await this.roomModel.findById(id)
  }

  async findAll(findAllRoomsDto: TFindAllRoomsDto) {
    return await this.roomModel.find(findAllRoomsDto)
  }

  async update(id: string, updateRoomDto: TUpdateRoomDto) {
    return await this.roomModel.updateOne({ _id: id }, { $set: updateRoomDto })
  }

  async create(createRoomDto: TCreateRoomDto) {
    return await this.roomModel.create(createRoomDto)
  }

  async createRoomToken(createRoomTokenDto: TCreateRoomTokenDto) {
    const at = new AccessToken(
      CONFIG.app.livekitApiKey,
      CONFIG.app.livekitSecretKey,
      { identity: createRoomTokenDto.user_id },
    )
    at.addGrant({ room: createRoomTokenDto.room_id })
    return at.toJwt()
  }

  async findAllRoomMessages(findAllRoomMessagesDto: TFindAllRoomMessagesDto) {
    return await this.roomMessageModel.find(findAllRoomMessagesDto)
  }

  async createRoomMessage(createRoomMessageDto: TCreateRoomMessageDto) {
    return await this.roomMessageModel.create(createRoomMessageDto)
  }
}

export const roomsService = new RoomsService()
