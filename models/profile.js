const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
      dob: Date,
    },
    images: {
      type: [String],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
