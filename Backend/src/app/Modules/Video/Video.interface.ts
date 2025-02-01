import { Types } from "mongoose";

export type TVideo = {
    name: string;
    userId: Types.ObjectId;
    fileUrl: string;
}