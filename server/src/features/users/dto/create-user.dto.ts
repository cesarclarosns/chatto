import { z } from 'zod'
import { EUserStatus } from '../models/user.model'
import { isValidObjectId } from 'mongoose'

export const createUserProfileDtoSchema = z.object({
  displayName: z.string(),
  bio: z.string(),
})

export const createUserSettingsDtoSchema = z.object({
  status: z.nativeEnum(EUserStatus),
})

export const createUserDtoSchema = z.object({
  _id: z
    .string()
    .refine((value) => isValidObjectId(value), {
      message: 'String must be a valid ObjectId',
    })
    .optional(),
  google_id: z.string().min(1).optional(),
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(10),
  profile: createUserProfileDtoSchema.optional(),
  settings: createUserSettingsDtoSchema.optional(),
})

export type TCreateUserDto = z.infer<typeof createUserDtoSchema>
