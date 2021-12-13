const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: { type: String },
  message: { type: String },
  isPsikolog: { type: Boolean, default: false },
});
module.exports = mongoose.model("message", messageSchema);
