import { UsersModule } from '@features/users/users.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { Attachment, AttachmentSchema } from './entities/attachment.entity';
import { StorageFactory } from './factories/storage.factory';

@Module({
  controllers: [AttachmentsController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Attachment.name,
        schema: AttachmentSchema,
      },
    ]),
    UsersModule,
  ],
  providers: [AttachmentsService, StorageFactory],
})
export class AttachmentsModule {}
