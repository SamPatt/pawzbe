const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const imageSchema = new mongoose.Schema({
//   url: {type: String, required: true},
//   description: { type: String},
//   alt: {type: String, default:""} 
// })

const profileSchema = new Schema(
  {
    petName: {
      type: String,
      required: true,
    },
    humanNames: {
      type: [String],
      required: true,
    },
    petPhoto: {
      profilePhoto: String,
      banner: String,
    },
    petDetails: {
      bio: String,
      favoriteToys: [String],
      breed: String,
      animalType: String,
      age: Number,
    },
    images: []
  },
  { timestamps: true }
);


module.exports = mongoose.model("Profile", profileSchema);
