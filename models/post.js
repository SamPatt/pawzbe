const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    petName: {
      type: String,
      required: true,
    },
    commentText: String,
    profileId: String,
  },
  { timestamps: true }
);


const imageSchema = new mongoose.Schema({
  url: {type: String, required: true},
  description: { type: String},
  alt: {type: String, default:""} 
})

const postSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    postDescription: String,
    postPhotoLink: String, 
    likes: {
      type: Number,
      default: 0,
    },
    likingUserProfileId: [String],
    postComments: [commentSchema],
    petName: String,
    profilePhoto: String,
    images: [imageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
