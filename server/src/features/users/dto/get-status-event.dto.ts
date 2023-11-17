import { IsArray } from 'class-validator'

export class GetStatusEventDto {
  @IsArray()
  userIds: string[]
}
