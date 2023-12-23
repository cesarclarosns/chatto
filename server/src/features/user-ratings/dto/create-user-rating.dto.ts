import { IsObjectId } from '@common/decorators/is-object-id.decorator';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateUserRatingDto {
  @IsObjectId()
  @IsOptional()
  user_id: string;

  @IsObjectId()
  @IsOptional()
  rater_id: string;

  @IsNumber()
  @Min(1)
  rating: number;
}
