import { IsEmail, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  username: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  displayName: string

  @IsOptional()
  @IsString()
  bio?: string
}
