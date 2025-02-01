import { model, Schema } from 'mongoose';
import { TVideo } from './Video.interface';

const videoSchema = new Schema<TVideo>(
  {
    // name: {
    //   type: String,
    // },
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   unique: false,
    //   ref: 'User',
    // },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Video = model<TVideo>('Video', videoSchema);
