import { z } from 'zod'
import { createUserDtoSchema } from '@features/users/dto/create-user.dto'

export const resetPasswordCallbackDtoSchema = createUserDtoSchema.pick({
  password: true,
})

export type TResetPasswordCallbackDto = z.infer<
  typeof resetPasswordCallbackDtoSchema
>
