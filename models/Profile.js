const { Schema, models, model } = require("mongoose");

const ProfileSchema = new Schema(
  {
    email: { type: String },
    password: { type: String },
  },
  {
    timestamps: true, // this will automatucally manage createAt and updateAt
  }
);

export const Profile =
  models.Profile || model("Profile", ProfileSchema, "admin");
