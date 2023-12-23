import { IsNumber, IsOptional } from 'class-validator';

export class IncreaseUserMetadataDto {
  @IsNumber()
  @IsOptional()
  'profile.videosCount'?: number;

  @IsNumber()
  @IsOptional()
  'profile.imagesCount'?: number;

  @IsNumber()
  @IsOptional()
  'profile.followersCount'?: number;

  @IsNumber()
  @IsOptional()
  'profile.subscriptionsCount'?: number;
}
