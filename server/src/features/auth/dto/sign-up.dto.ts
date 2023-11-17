import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator'

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  username: string

  @IsStrongPassword()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  displayName: string
}
