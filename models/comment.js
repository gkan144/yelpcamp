var mongoose = require("mongoose");

module.exports = mongoose.model("Comment", new mongoose.Schema({
   author: {id:{type: mongoose.Schema.Types.ObjectId, ref: "User"},username: String},
   text: String
}));