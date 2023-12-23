import { IsObjectId } from '@common/decorators/is-object-id.decorator';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { EUserStatus } from '../entities/user.entity';

class Profile {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profilePicture?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  coverPicture?: string;
}

class Settings {
  @IsEnum(EUserStatus)
  @IsOptional()
  status?: EUserStatus;
}

export class CreateUserDto {
  @IsObjectId()
  @IsOptional()
  _id?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @IsOptional()
  google_id?: string;

  @ValidateNested()
  @Type(() => Profile)
  @IsOptional()
  profile?: Profile;

  @ValidateNested()
  @Type(() => Settings)
  @IsOptional()
  settings?: Settings;
}
