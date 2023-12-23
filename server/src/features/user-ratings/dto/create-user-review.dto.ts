import { IsObjectId } from '@common/decorators/is-object-id.decorator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserReviewDto {
  @IsObjectId()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsObjectId()
  @IsOptional()
  reviewer_id: string;
}
