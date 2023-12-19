import { z } from 'zod'
import { createUserDtoSchema } from '@features/users/dto/create-user.dto'

export const signUpDtoSchema = createUserDtoSchema.pick({
  email: true,
  username: true,
  password: true,
})

export type TSignUpDto = z.infer<typeof signUpDtoSchema>
