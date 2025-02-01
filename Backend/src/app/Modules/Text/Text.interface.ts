import { Types } from "mongoose";

export type TText = {
    name: string;
    userId: Types.ObjectId;
    fileUrl: string;
}