const { Schema, models, model } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: { type: String },
    slug: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    blogcategory: [{ type: String }],
    tags: [{ type: String }],
    status: { type: String },
    comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
  },
  {
    timestamps: true, // this will automatucally manage createAt and updateAt
  }
);

export const Blog = models.Blog || model("Blog", BlogSchema, "blogs");
