const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  nickname: { type: String, required: true, maxLength: 8 },
  room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  board: { type: Integer },
  beans: { type: Array },

});

// Virtual for author's URL
// AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
//   return `/catalog/author/${this._id}`;
// });

// Export model
module.exports = mongoose.model("Player", PlayerSchema);
