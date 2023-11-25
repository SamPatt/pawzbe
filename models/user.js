const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    authId : {
      type: String,
      required: true,
      unique: true,
    },
    email: String,
    avatar: String,
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('User', userSchema)