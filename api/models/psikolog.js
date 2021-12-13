const mongoose = require("mongoose");
const psikologSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  sipp: { type: String, required: true },
  operation: { type: String, required: true },
});
module.exports = mongoose.model("psikolog", psikologSchema);
