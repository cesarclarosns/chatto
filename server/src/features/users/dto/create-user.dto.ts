import { z } from 'zod'
import { EUserStatus } from '../models/user.model'

export const createUserProfileDtoSchema = z.object({
  displayName: z.string(),
  bio: z.string(),
})

export const createUserSettingsDtoSchema = z.object({
  status: z.nativeEnum(EUserStatus),
})

export const createUserDtoSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(10),
  profile: createUserProfileDtoSchema,
  settings: createUserSettingsDtoSchema,
})

export type TCreateUserDto = z.infer<typeof createUserDtoSchema>
