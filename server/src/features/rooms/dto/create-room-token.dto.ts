import { z } from 'zod'
import { isValidObjectId } from 'mongoose'

export const createRoomTokenDtoSchema = z.object({
  user_id: z.string().refine((value) => isValidObjectId(value)),
  room_id: z.string().refine((value) => isValidObjectId(value)),
})

export type TCreateRoomTokenDto = z.infer<typeof createRoomTokenDtoSchema>
