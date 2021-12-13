const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  parentsPhoneNumber: { type: String, required: true },
});
module.exports = mongoose.model("student", studentSchema);
