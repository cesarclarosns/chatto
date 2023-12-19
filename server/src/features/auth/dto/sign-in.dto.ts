import { createUserDtoSchema } from '@features/users/dto/create-user.dto'
import { z } from 'zod'

export const signInDtoSchema = createUserDtoSchema.pick({
  email: true,
  password: true,
})

export type TSignInDto = z.infer<typeof signInDtoSchema>
