const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    url: String,
    publicId: String,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
