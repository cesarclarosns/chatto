import { z } from 'zod'

export const findAllRoomMessagesDtoSchema = z.object({})

export type TFindAllRoomMessagesDto = z.infer<
  typeof findAllRoomMessagesDtoSchema
>
