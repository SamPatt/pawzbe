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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
