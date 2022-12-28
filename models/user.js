const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  mobile:{type:Number,required:false},
  profile_pic:{type:String,required:false}
});

module.exports = mongoose.model("user", userSchema);