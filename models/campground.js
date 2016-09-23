var mongoose = require("mongoose");

module.exports = mongoose.model("Campground", new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
   author: {id:{type: mongoose.Schema.Types.ObjectId, ref: "User"}, username: String}
}));