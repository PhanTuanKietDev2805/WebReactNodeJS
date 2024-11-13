const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotifySchema = new Schema(
  {
    massage: String,
    detailId: String,
    isRead: Boolean,
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("notify", NotifySchema);
