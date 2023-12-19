import { RequestHandler, Router } from 'express'
import { roomsService, RoomsService } from './rooms.service'
import { createRoomDtoSchema } from './dto/create-room.dto'
import { accessTokenGuard } from '@features/auth/guards/access-token.guard'

export class RoomsController {
  router: Router
  private readonly roomsService: RoomsService

  constructor() {
    this.router = Router()
    this.roomsService = roomsService

    this.router.use(accessTokenGuard)

    this.router.post('/rooms', this.create)
    this.router.get('/roooms/:room_id', this.findOne)
  }

  create: RequestHandler = async (req, res) => {
    const createRoomDto = await createRoomDtoSchema.parseAsync(req.body)

    console.log(req, res, createRoomDto)
  }

  findOne: RequestHandler = (req, res) => {
    const { room_id } = req.params

    console.log(req, res, room_id)
  }
}

export const roomsController = new RoomsController()
