import { CreateUserDto } from '@features/users/dto/create-user.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto extends CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;
}
