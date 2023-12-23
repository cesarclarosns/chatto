import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Upload } from '@aws-sdk/lib-storage';
import { CONFIG_VALUES } from '@config/configuration';
import { EUserRole } from '@features/users/entities/user.entity';
import { UsersService } from '@features/users/users.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import SftpClient from 'ssh2-sftp-client';

import { AttachmentDto } from '../dto/attachment.dto';
import { CreateAttachmentDto } from '../dto/create-attachment.dto';

export interface IStorage {
  upload: (
    createAttachmentDto: CreateAttachmentDto,
    file: Express.Multer.File,
  ) => Promise<string>;

  download: (attachments: AttachmentDto[]) => Promise<AttachmentDto[]>;
}

export class AwsStorage implements IStorage {
  private readonly s3Client: S3Client;

  constructor(
    private config: {
      s3: {
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
      };
      cloudfront: {
        distributionDomain: string;
        keyPairId: string;
        privateKey: string;
      };
    },
  ) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
      region: config.s3.region,
    });
  }

  async upload(
    createAttachmentDto: CreateAttachmentDto,
    file: Express.Multer.File,
  ) {
    console.log(file);
    const Body = '',
      Bucket = '',
      Key = '';
    try {
      const parallelUploads3 = new Upload({
        client: this.s3Client,
        leavePartsOnError: false, // optional manually handle dropped parts
        params: { Body, Bucket, Key },
        tags: [{ Key: '', Value: '' }],
      });

      parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress);
      });

      await parallelUploads3.done();
    } catch (e) {
      console.log(e);
    }
    return '';
  }

  async download(attachments: AttachmentDto[]) {
    attachments.forEach((attachment) => {
      const cloudfrontDistribution = this.config.cloudfront.distributionDomain;
      const s3ObjectKey = attachment.formats.src.filePath;
      const url = `${cloudfrontDistribution}/${s3ObjectKey}`;

      attachment.formats.src.fileUrl = getSignedUrl({
        dateLessThan: '',
        keyPairId: this.config.cloudfront.keyPairId,
        privateKey: this.config.cloudfront.privateKey,
        url,
      });
    });

    return attachments;
  }
}

export class SftpStorage implements IStorage {
  private readonly sftpClient: SftpClient;

  constructor(
    private config: {
      host: string;
      port: number;
      username: string;
      password: string;
    },
  ) {
    this.sftpClient = new SftpClient();

    (async () => {
      await this.sftpClient.connect(this.config);
    })();
  }

  async upload(
    createAttachmentDto: CreateAttachmentDto,
    file: Express.Multer.File,
  ) {
    const id = new mongoose.Types.ObjectId().toString();

    const result = await this.sftpClient.put(file.buffer, '');
    console.log(result);

    return id;
  }

  async download(attachments: AttachmentDto[]) {
    await Promise.all(
      attachments.map(async (attachment) => {
        const promises: Promise<any>[] = [];
        console.log(attachment, promises);
        return await Promise.all([]);
      }),
    );
    return attachments;
  }
}

@Injectable()
export class StorageFactory {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async createStorage(user_id: string): Promise<IStorage> {
    const user = await this.usersService.findOneById(user_id);

    if (user.role == EUserRole.admin) {
      return new SftpStorage({
        host: '',
        password: '',
        port: 8080,
        username: '',
      });
    } else {
      return new AwsStorage({
        cloudfront: {
          distributionDomain: this.configService.getOrThrow<string>(
            CONFIG_VALUES.STORAGE.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN,
          ),
          keyPairId: this.configService.getOrThrow<string>(
            CONFIG_VALUES.STORAGE.AWS_CLOUDFRONT_KEYPAIR_ID,
          ),
          privateKey: this.configService.getOrThrow<string>(
            CONFIG_VALUES.STORAGE.AWS_CLOUDFRONT_PRIVATE_KEY,
          ),
        },
        s3: {
          accessKeyId: this.configService.getOrThrow<string>(
            CONFIG_VALUES.STORAGE.AWS_S3_ACCESS_KEY_ID,
          ),
          region: this.configService.getOrThrow<string>(
            CONFIG_VALUES.STORAGE.AWS_S3_REGION,
          ),
          secretAccessKey: this.configService.getOrThrow<string>(
            CONFIG_VALUES.STORAGE.AWS_S3_SECRET_ACCESS_KEY,
          ),
        },
      });
    }
  }
}
