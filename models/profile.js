const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    petName: {
      type: String,
      required: true,
    },
    humanName: {
      type: [String],
      required: true,
    },
    petPhoto: {
      profile: String,
      images: [String],
      banner: String,
    },
    petDetails: {
      bio: String,
      favoriteToys: String,
      breed: String,
      animalType: String,
      DOB: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
