const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  code: String,
  fee: Number,
  duration: Number,
  description: String,
});

module.exports = mongoose.model("Course", courseSchema);
