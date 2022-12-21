const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: { type: String, required: true },
  desription: { type: String, required: true },
  tag: { type: String, required: true },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("notes", NoteSchema);
