import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { FindAllAttachmentsDto } from './dto/find-all-attachments.dto';

/**
 * TODO:
 * Add validator for size of attachments
 *  Video: 2gb
 *  Images: 10mb
 *  Audio: 10mb
 */

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {}))
  create(
    @Body() createAttachmentDto: CreateAttachmentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(createAttachmentDto, file);
    // return this.attachmentsService.create(createAttachmentDto, file);
  }

  @Get()
  findAll(@Query() findAllAttachmentsDto: FindAllAttachmentsDto) {
    console.log('ids:', findAllAttachmentsDto.ids);
    // return this.attachmentsService.findAll(findAllAttachmentsDto);
  }
}
