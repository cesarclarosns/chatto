import { z } from 'zod'

export const userDtoSchema = z.object({})

export type TUserDto = z.infer<typeof userDtoSchema>
