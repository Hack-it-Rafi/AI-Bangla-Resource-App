import { model, Schema } from 'mongoose';
import { TSpeech } from './Speech.interface';

const speechSchema = new Schema<TSpeech>(
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
  },
  {
    timestamps: true,
  },
);

export const Speech = model<TSpeech>('Speech', speechSchema);
