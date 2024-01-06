const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/practiceauth");

var userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
});

module.exports = mongoose.model("user", userSchema);
