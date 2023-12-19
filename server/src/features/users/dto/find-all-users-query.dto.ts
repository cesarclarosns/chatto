import { z } from 'zod'

export const findAllUsersQueryDtoSchema = z.object({})

export type TFindAllUsersQueryDto = z.infer<typeof findAllUsersQueryDtoSchema>
