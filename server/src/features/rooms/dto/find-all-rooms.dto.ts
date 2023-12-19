import { z } from 'zod'

export const findAllRoomsDtoSchema = z.object({})

export type TFindAllRoomsDto = z.infer<typeof findAllRoomsDtoSchema>
