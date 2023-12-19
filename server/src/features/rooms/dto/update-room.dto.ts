import { z } from 'zod'
import { createRoomDtoSchema } from './create-room.dto'

export const updateRoomDtoSchema = createRoomDtoSchema.partial()

export type TUpdateRoomDto = z.infer<typeof updateRoomDtoSchema>
