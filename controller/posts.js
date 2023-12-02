const { restart } = require("nodemon");
const Post = require("../models/post");
const Profile = require("../models/profile");

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const { clConfig } = require("../config/cloudinary");

cloudinary.config(clConfig);

module.exports = {
  index,
  show,
  delete: deletePost,
  addComment,
  create,
  deleteComment,
  like,
};

// fetch all posts, sort by date, render index page
async function index(req, res) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.render("fuzzies/posts/index", {
      title: "All Posts",
      posts: posts,
      currentProfile: req.user.profiles[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}

// create a new post
async function create(req, res) {
  try {
    req.body.profile = req.user.profiles[0]._id;
    const profile = await Profile.findById(req.user.profiles[0]._id);
    req.body.petName = profile.petName;

    req.body.profilePhoto = profile.petPhoto.profilePhoto;
    let result = await streamUpload(req);

    const newImage = { url: result.url };

    req.body.images = [];

    req.body.images.push(newImage);

    const post = await Post.create(req.body);

    res.redirect("/posts/");
  } catch (err) {
    console.log(err);
  }
}

// render post show page
async function show(req, res) {
  try {
    const currentProfile = req.user.profiles[0]._id;
    const post = await Post.findById(req.params.id);
    const dogBreeds = res.locals.dogBreeds;
    const catBreeds = res.locals.catBreeds;

    let breedInfo = null;

    if (profile.petDetails.breed) {
      const breedName = profile.petDetails.breed;
      const animalType = profile.petDetails.animalType;

      if (animalType === "Dog") {
        const breedData = dogBreeds.find((breed) => breed.name === breedName);
        if (breedData) {
          breedInfo = breedData.temperament;
        }
      } else if (animalType === "Cat") {
        const breedData = catBreeds.find((breed) => breed.name === breedName);
        if (breedData) {
          breedInfo = breedData.description;
        }
      }
    }
    res.render("fuzzies/posts/show", {
      title: post.petName,
      post: post,
      breedInfo,
    });
  } catch (err) {
    console.log(err);
  }
}

// add comments to a specific post
async function addComment(req, res) {
  try {
    const profile = await Profile.findById(req.user.profiles[0]._id);
    req.body.petName = profile.petName;
    const post = await Post.findById(req.params.id);
    //creating profile id key for the form
    req.body.profileId = req.user.profiles[0]._id;
    post.postComments.push(req.body);
    await post.save();
    res.redirect("/posts");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}

// delete comments from a specific post
async function deleteComment(req, res) {
  try {
    const profile = await Profile.findById(req.user.profiles[0]._id);

    req.body.petName = profile.petName;
    const post = await Post.findById(req.params.id);
    const commentIndex = req.body.commentIndex;

    if (profile._id.toString() === req.body.currentProfile) {
      post.postComments.splice(commentIndex, 1);
    }

    await post.save(), res.redirect(`/profiles/${post.profile._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}

// like/unlike a post, based on logged in user
async function like(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likingUserProfileId.includes(req.user.profiles[0]._id.toString())
    ) {
      post.likes--;
      //remove ID after unliking
      post.likingUserProfileId = post.likingUserProfileId.filter(
        (id) => id !== req.user.profiles[0]._id.toString()
      );
    } else {
      post.likes++;
      post.likingUserProfileId.push(req.user.profiles[0]._id.toString());
      req.body.likingUserProfileId = req.user.profiles[0]._id;
    }

    await post.save();
    res.redirect("/posts/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// handle post deletion
async function deletePost(req, res) {
  try {
    const profile = await Profile.findById(req.user.profiles[0]._id);
    const post = await Post.findById(req.params.id);

    // Check if the user is the author of the post
    if (post.profile.toString() === profile._id.toString()) {
      await Post.deleteOne({ _id: req.params.id });
      res.redirect(`/profiles/${profile._id}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

// handle file uploading
function streamUpload(req) {
  return new Promise(function (resolve, reject) {
    let stream = cloudinary.uploader.upload_stream(function (error, result) {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
}
