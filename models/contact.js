const { Schema, models, model } = require("mongoose");

const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    lname: { type: String },
    email: { type: String, required: true },
    company: { type: String },
    phone: { type: String, required: true },
    country: { type: String },
    price: { type: String },
    description: { type: String },
    project: [{ type: String }],
  },
  {
    timestamps: true, // this will automatucally manage createAt and updateAt
  }
);

export const Contact =
  models.Contact || model("Contact", ContactSchema, "contacts");
