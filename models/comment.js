var mongoose = require("mongoose");

module.exports = mongoose.model("Comment", new mongoose.Schema({
   author: String,
   text: String
}));