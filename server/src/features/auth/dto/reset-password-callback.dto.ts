import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordCallbackDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
