const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profile: { type: String, default: "default_profile.png" },
  psikolog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "psikolog",
    default: null,
  },
  students: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    default: null,
  },
});
module.exports = mongoose.model("user", usersSchema);
