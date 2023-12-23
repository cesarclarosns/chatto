import { IsObjectId } from '@common/decorators/is-object-id.decorator';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  EAttachmentPreprocessingStatus,
  EAttachmentType,
} from '../entities/attachment.entity';

class FormatDto {
  @IsString()
  @IsNotEmpty()
  filePath: string;
}

class FormatsDto {
  @IsObject()
  @ValidateNested()
  @Type(() => FormatDto)
  @IsOptional()
  src: FormatDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FormatDto)
  @IsOptional()
  thumbnail: FormatDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FormatDto)
  @IsOptional()
  preview: FormatDto;
}

class BucketsDto {
  @IsString()
  @IsNotEmpty()
  preprocessing: string;

  @IsString()
  @IsNotEmpty()
  postprocessing: string;
}

class PreprocessingDto {
  @IsEnum(EAttachmentPreprocessingStatus)
  status: EAttachmentPreprocessingStatus;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;
}

export class CreateAttachmentDto {
  @IsObjectId()
  @IsOptional()
  _id: string;

  @IsObjectId()
  user_id: string;

  @IsEnum(EAttachmentType)
  type: EAttachmentType;

  @IsString()
  @IsNotEmpty()
  hash: string;

  @IsNumber()
  size: number;

  @IsObject()
  @ValidateNested()
  @Type(() => BucketsDto)
  buckets: BucketsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PreprocessingDto)
  preprocessing: PreprocessingDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FormatsDto)
  formats: FormatsDto;
}
