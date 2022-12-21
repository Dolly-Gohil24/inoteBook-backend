const mongoose = require("mongoose");

const NoteSchema = new Schema({
  title: { type: String, required: true },
  desription: { type: String, required: true },
  tag: { type: String, required: true },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", NoteSchema);
