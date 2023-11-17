import { IsNotEmpty, IsString } from 'class-validator'

export class GetStatusEventDto {
  @IsString()
  @IsNotEmpty()
  roomId: string
}
