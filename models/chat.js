// models/hat.js

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    message: {
      type: String,
      trim: true
    },

    attachment: {
      url: { type: String },
      publicId: { type: String },
      type: {
        type: String,
        enum: ["image", "video", "pdf", "file"]
      }
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Chat || mongoose.model("Chat", chatSchema);
