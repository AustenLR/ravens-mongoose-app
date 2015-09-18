var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/ravens_app");

module.exports.Raven = require("./raven");