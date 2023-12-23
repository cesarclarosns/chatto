import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

import { EUserStatus } from '../entities/user.entity';

export class UserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  username: string;

  profile: {
    displayName: string;

    profilePicture: string;

    coverPicture: string;

    bio: string;

    lastConnection: string;

    imagesCount: number;

    videosCount: number;

    followersCount: number;

    subscriptionsCount: number;
  };

  settings: {
    status: EUserStatus;
  };
}
