import { model, Schema } from 'mongoose';
import { TPdf } from './Pdf.interface';

const pdfSchema = new Schema<TPdf>(
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

export const Pdf = model<TPdf>('Pdf', pdfSchema);
