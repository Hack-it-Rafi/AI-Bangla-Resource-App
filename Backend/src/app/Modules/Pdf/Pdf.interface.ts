import { Types } from "mongoose";

export type TPdf = {
    name: string;
    userId: Types.ObjectId;
    fileUrl: string;
}