import { z } from 'zod'

export const resetPasswordDtoSchema = z.object({
  email: z.string().email(),
})

export type TResetPasswordDto = z.infer<typeof resetPasswordDtoSchema>
