import { z } from 'zod'

export const resetPasswordCallbackQueryDtoSchema = z.object({
  token: z.string().min(1),
})

export type TResetPasswordCallbackQueryDto = z.infer<
  typeof resetPasswordCallbackQueryDtoSchema
>
