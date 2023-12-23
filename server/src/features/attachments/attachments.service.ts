import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AttachmentDto } from './dto/attachment.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { FindAllAttachmentsDto } from './dto/find-all-attachments.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { Attachment } from './entities/attachment.entity';
import { StorageFactory } from './factories/storage.factory';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment.name) private attachmentModel: Model<Attachment>,
    private storageFactory: StorageFactory,
  ) {}

  async create(
    user_id: string,
    createAttachmentDto: CreateAttachmentDto,
    file: Express.Multer.File,
  ) {
    // Create storage
    const storage = await this.storageFactory.createStorage(
      createAttachmentDto.user_id,
    );
    // Upload file using the storage
    const attachment_id = await storage.upload(createAttachmentDto, file);

    return this.attachmentModel.create({
      ...createAttachmentDto,
      _id: attachment_id,
    });
  }

  async findAll(user_id: string, findAllAttachmentsDto: FindAllAttachmentsDto) {
    let attachments: AttachmentDto[] = await this.attachmentModel.find({
      findAllAttachmentsDto,
    });

    // Create storage
    const storage = await this.storageFactory.createStorage(user_id);
    // Download attachments using the storage
    attachments = await storage.download(attachments);

    return attachments;
  }

  async updateAttachmentDto(
    id: string,
    updateAttachmentDto: UpdateAttachmentDto,
  ) {
    return await this.attachmentModel.updateOne(
      { _id: id },
      updateAttachmentDto,
    );
  }
}
