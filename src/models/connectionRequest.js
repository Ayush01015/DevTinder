const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// COMPOUND INDEX
// This ensures A can send a request to B only once.
connectionRequestSchema.index({ fromUserID: 1, toUserID: 1 }, { unique: true });

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest; 