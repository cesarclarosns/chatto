import { isValidObjectId } from 'mongoose'
import { z } from 'zod'

export const createRoomMessageDtoSchema = z.object({
  room_id: z.string().refine((value) => isValidObjectId(value), {
    message: 'room_id must be a valid ObjectId',
  }),
  user_id: z.string().refine((value) => isValidObjectId(value), {
    message: 'user_id must be a valid ObjectId',
  }),
  content: z.string().min(1),
})

export type TCreateRoomMessageDto = z.infer<typeof createRoomMessageDtoSchema>
