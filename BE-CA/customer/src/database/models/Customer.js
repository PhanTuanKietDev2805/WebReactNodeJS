const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    email: String,
    password: String,
    salt: String,
    phone: String,
    role: {
      type: String,
      required: true,
      enum: ["CUSTOMER", "ADMIN"],
      default: "CUSTOMER",
    },
    address: [{ type: mongoose.Types.ObjectId, ref: "address", default: [] }],
    wishlist: [
      {
        _id: { type: String, require: true },
        name: { type: String },
        description: { type: String },
        banner: { type: String },
        avalable: { type: Boolean },
        price: { type: Number },
      },
    ],
    orders: [{ type: mongoose.Types.ObjectId, ref: "order", default: [] }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("customer", CustomerSchema);
