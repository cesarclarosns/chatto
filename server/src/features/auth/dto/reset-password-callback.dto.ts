import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class ResetPasswordCallbackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string
}
