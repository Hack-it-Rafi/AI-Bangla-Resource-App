import { Types } from "mongoose";

export type TSpeech = {
    name: string;
    userId: Types.ObjectId;
    fileUrl: string;
}