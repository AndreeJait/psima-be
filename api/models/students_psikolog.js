const mongoose = require("mongoose");
const studentsPsikologSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  student: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  psikolog: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  message: [{ type: mongoose.Schema.Types.ObjectId, ref: "message" }],
  updatedAt: { type: Number },
});
module.exports = mongoose.model("students_psikolog", studentsPsikologSchema);
