// logs.js
import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: String,
  product: mongoose.Schema.Types.ObjectId,
  productSnapshot: {
    name: String,
    price: Number,
    totalAmount: Number
  },
  user: mongoose.Schema.Types.ObjectId,
  timestamp: Date
});

export const Log = mongoose.model("Log", logSchema);
