const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    name: String,
    googleId: {
      type: String,
      required: true,
    },
    email: String,
    avatar: String,
  },
  {
    timestamps: true,
  })

  
// <!-- ADDED BY ELLIE -->
//for signup
const newUserSchema = new Schema ({
  email: String,
  password: String
},{timestamps: true})
module.exports = mongoose.model('NewUser', newUserSchema)
// <!-- ADDED BY ELLIE -->

module.exports = mongoose.model('User', userSchema)