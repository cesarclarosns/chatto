import { z } from 'zod'

export const paginationQueryDtoSchema = z.object({
  filter: z.string(),
  sort: z.string(),
  skip: z.string(),
  limit: z.string(),
})

export type TPaginationQueryDto = z.infer<typeof paginationQueryDtoSchema>
