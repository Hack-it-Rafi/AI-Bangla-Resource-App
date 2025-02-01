import { model, Schema } from 'mongoose';
import { TText } from './Text.interface';

const textSchema = new Schema<TText>(
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

export const Text = model<TText>('Text', textSchema);
