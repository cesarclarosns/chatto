import { z } from 'zod'
import { createUserDtoSchema } from './create-user.dto'

export const updateUserDtoSchema = createUserDtoSchema.partial()

export type TUpdateUserDto = z.infer<typeof updateUserDtoSchema>
