import { model, Schema } from 'mongoose';
import { TFile } from './File.interface';
import { Types } from './File.constant';

const fileSchema = new Schema<TFile>(
  {
    name: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      unique: false,
      ref: 'User',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Types,
    },
  },
  {
    timestamps: true,
  },
);

export const File = model<TFile>('File', fileSchema);
