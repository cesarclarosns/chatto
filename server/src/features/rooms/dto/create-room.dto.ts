import { z } from 'zod'
import { ERoomStatus } from '../models/room.model'

export const createRoomDtoSchema = z.object({
  status: z.nativeEnum(ERoomStatus),
  participants: z.string().min(1).array(),
  language: z.string().min(1),
})

export type TCreateRoomDto = z.infer<typeof createRoomDtoSchema>
