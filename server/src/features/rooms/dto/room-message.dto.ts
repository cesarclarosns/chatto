import { z } from 'zod'

export const roomMessageDtoSchema = z.object({})

export type TRoomMessageDto = z.infer<typeof roomMessageDtoSchema>
