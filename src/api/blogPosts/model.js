import mongoose from "mongoose";
import { model } from "mongoose";

const { Schema } = mongoose

const blogPostSchema = new Schema(
    {
    category: {type: String, required: true},
    title: {type: String, required: true},
    cover: {type: String, required: true},
    readTime:{
        value: {type: Number, required: true},
        unit: {
            type: String,
            required: true,
            validate: {
              validator: function (unit) {
                return ["seconds", "minutes", "hours"].includes(unit);
              },
              message: "Unit must be one of 'seconds', 'minutes', or 'hours'",
            },
          },
    },
    author:{
        name: {type: String, required: true},
    },
    content:{type: String, required: true}

    },
    {
        timestamps: true,
    }
)

export default model("BlogPosts", blogPostSchema)