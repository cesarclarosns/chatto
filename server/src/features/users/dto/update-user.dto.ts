import { PartialType } from '@nestjs/mapped-types'
import { IsDateString, IsOptional } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsDateString()
  lastActive?: string
}
