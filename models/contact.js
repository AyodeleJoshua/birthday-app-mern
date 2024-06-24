const mongoose = require("mongoose");
const { softDeletePlugin } = require("soft-delete-plugin-mongoose");

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

contactSchema.plugin(softDeletePlugin);

module.exports = mongoose.model("Contact", contactSchema);
