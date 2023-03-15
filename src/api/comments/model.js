import mongoose from "mongoose";
import { model } from "mongoose";

const { Schema } = mongoose

const commentSchema = new Schema(
    {
        content: { type: String, required:true},
        author: { type: String, required:true},
    },
    {
        timestamps: true,
    }
)

export default model("Comment", commentSchema)