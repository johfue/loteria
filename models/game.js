const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  room_number: { type: String, required: true, maxLength: 6 },
  win_condition: { type: String, enum: ["diagonal", "column", "row", "corner", "center", "BlackOut",] },
  current_card: { type: Integer },
  banned_names: { type: Array },
});

// Virtual for author's URL
// AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
//   return `/catalog/author/${this._id}`;
// });

// Export model
module.exports = mongoose.model("Room", GameSchema);
