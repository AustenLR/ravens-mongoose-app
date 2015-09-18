var mongoose = require("mongoose");

var ravenSchema = new mongoose.Schema({
  name : String,
  position : String,
  number : Number,
  picture : String
});

var Raven = mongoose.model('Raven', ravenSchema);

module.exports = Raven;