import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

/**
 * TODO:
 * Define fileKey: /uploads/:user_id/:attachment_id/:format/:filename
 */

/**
 * MimeTypes
 * video: mp4 | avi | mov | flv
 * image: jpg | jpeg | png | gif
 * audio: mp3 | wav
 * document: *
 */

export enum EAttachmentType {
  'image' = 'image',
  'video' = 'video',
  'audio' = 'audio',
  'document' = 'document',
}

export enum EAttachmentPreprocessingStatus {
  'pending' = 'pending',
  'completed' = 'completed',
  'failed' = 'failed',
}

class Preprocessing {
  @Prop({
    default: EAttachmentPreprocessingStatus.pending,
    enum: EAttachmentPreprocessingStatus,
    required: true,
    type: String,
  })
  status: EAttachmentPreprocessingStatus;

  @Prop({ required: true, type: String })
  filePath: string;

  @Prop({ required: true, type: String })
  fileName: string;
}

class Format {
  @Prop({ required: true, type: String })
  filePath: string;
}

class Formats {
  @Prop({ type: Format })
  src: Format;

  @Prop({ type: Format })
  thumbnail: Format;

  @Prop({ type: Format })
  preview: Format;
}

class Buckets {
  @Prop({ required: true, type: String })
  preprocessing: string;

  @Prop({ required: true, type: String })
  postprocessing: string;
}

@Schema({
  collection: 'attachments',
  strict: true,
  timestamps: true,
})
export class Attachment extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  user_id: string;

  @Prop({ enum: EAttachmentType, required: true, type: String })
  type: EAttachmentType;

  @Prop({ required: true, type: String })
  hash: string;

  @Prop({ required: true, type: Number })
  size: number;

  @Prop({ required: true, type: Buckets })
  buckets: Buckets;

  @Prop({ required: true, type: Preprocessing })
  preprocessing: Preprocessing;

  @Prop({
    default: {},
    required: true,
    type: Format,
  })
  formats: Formats;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);

AttachmentSchema.index({ hash: 1, size: 1, user_id: 1 });

AttachmentSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

export type TAttachmentFilterQuery = FilterQuery<Attachment>;
