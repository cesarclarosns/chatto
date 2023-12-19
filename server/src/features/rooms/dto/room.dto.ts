import { z } from 'zod'

export const roomDtoSchema = z.object({})

export type TRoomDto = z.infer<typeof roomDtoSchema>
