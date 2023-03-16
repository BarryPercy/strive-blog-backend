import mongoose from "mongoose";
import { model } from "mongoose";

const { Schema } = mongoose

const blogPostSchema = new Schema(
    {
    category: {type: String, required: true},
    title: {type: String, required: true},
    cover: {type: String},
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
    authors:[{ type: Schema.Types.ObjectId, ref: "Author" }],
    content:{type: String, required: true},
    comments:[
      {
        content: String,
        author: String
      }
    ],
    likes:[{type: String}]
    },
    {
        timestamps: true,
    }
)

blogPostSchema.static("findBlogPostsWithAuthors", async function(query) {
   const blogPosts = await this.find(query.criteria, query.options.fields)
        .limit(query.options.limit)
        .skip(query.options.skip)
        .sort(query.options.sort)
        .populate({ path: "authors", select: "firstName lastName"})
      const total = await this.countDocuments(query.criteria)
      const limit = query.options.limit? query.options.limit:total
      return {blogPosts, total, limit}
})

export default model("BlogPost", blogPostSchema)