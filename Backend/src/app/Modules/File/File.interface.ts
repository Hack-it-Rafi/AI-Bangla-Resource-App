import { Types } from "mongoose";

export type TType = 'PDF' | 'DOC' | 'TXT' | 'VIDEO' | 'AUDIO';

export type TFile = {
    name: string;
    userId: Types.ObjectId;
    fileUrl: string;
    type: TType;
}