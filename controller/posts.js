const { restart } = require("nodemon");
const Post = require("../models/post");
const Profile = require("../models/profile");

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const { clConfig } = require("../config/cloudinary");

// console.log(clConfig)

cloudinary.config(clConfig);

module.exports = {
  index,
  show,
  delete: deletePost,
  addComment,
  create,
  deleteComment,
  addPhoto,
  like,
};

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

async function create(req, res) {
  try {
    req.body.profile = req.user.profiles[0]._id;
    const profile = await Profile.findById(req.user.profiles[0]._id);
    req.body.petName = profile.petName;

    req.body.profilePhoto = profile.petPhoto.profilePhoto;
    console.log("Calling cloudinary stream");
    let result = await streamUpload(req);

    const newImage = { url: result.url };

    req.body.images = [];

    req.body.images.push(newImage);

    const post = await Post.create(req.body);
    console.log(post);

    res.redirect("/posts/");
  } catch (err) {
    console.log(err);
  }
}

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

async function deleteComment(req, res) {
  try {
    // const owner =
    //   req.user.profiles[0]._id.toString() === req.params.id ? true : false;
    const profile = await Profile.findById(req.user.profiles[0]._id);

    req.body.petName = profile.petName;
    const post = await Post.findById(req.params.id);
    const commentIndex = req.body.commentIndex;
    console.log("this is commentIndex from ejs:", commentIndex);
    console.log("this is array of comments from db:", post.postComments);
    if (profile._id.toString() === req.body.currentProfile) {
      console.log(
        "this is req.body.current profile : ",
        req.body.currentProfile
      );
      console.log("this is post.profile._id : ", post.profile._id);
      console.log(
        "this is post.postComments[commentIndex].profileId : ",
        post.postComments[commentIndex].profileId
      );
      console.log("this is profile._id : ", profile._id);
      console.log(
        "this is req.user.profiles[0]._id : ",
        req.user.profiles[0]._id.toString()
      );
      post.postComments.splice(commentIndex, 1);
    }

    await post.save(), res.redirect(`/profiles/${post.profile._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}

// async function deletePost(req, res) {
//   try {
//     const owner =
//       req.user.profiles[0]._id.toString() === req.params.id ? true : false;
//     const post = await Post.deleteOne({ _id: req.params.id });
//     const profile = await Profile.findById(req.user.profiles[0]._id);
//     const posts = await Post.find({ profile: profile._id });
//     const dogBreeds = res.locals.dogBreeds;
//     const catBreeds = res.locals.catBreeds;

//     let breedInfo = null;

//     if (profile.petDetails.breed) {
//       const breedName = profile.petDetails.breed;
//       const animalType = profile.petDetails.animalType;

//       if (animalType === "Dog") {
//         const breedData = dogBreeds.find((breed) => breed.name === breedName);
//         if (breedData) {
//           breedInfo = breedData.temperament;
//         }
//       } else if (animalType === "Cat") {
//         const breedData = catBreeds.find((breed) => breed.name === breedName);
//         if (breedData) {
//           breedInfo = breedData.description;
//         }
//       }
//     }
//     res.render("fuzzies/profiles/show", {
//       title: profile.petName + "'s Page",
//       profile: profile,
//       posts: posts,
//       breedInfo,
//       owner,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//   }
// }

async function like(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    // const postId = post._id
    // console.log("this is postId:", postId)
    // console.log("this is all likes:", like)
    // console.log("this is the liked post:", post)
    //console.log("my req.user.profiles[0]._id:", req.user.profiles[0]._id.toString())
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

async function deletePost(req, res) {
  //   try {

  //     const profile = await Profile.findById(req.user.profiles[0]._id);
  //     const post = await Post.findById(req.params.id);
  //     console.log("this is profile._id : ", profile._id)
  //     console.log("this is post.profile._id : ", post.profile._id)
  //     console.log("this is req.user.profiles[0]._id : ", req.user.profiles[0]._id)
  //     if (post.profile._id === req.user.profiles[0]._id){
  //       await post.deleteOne();
  //     }

  //     res.redirect(`/profiles/${post.profile}`);

  //     }catch (err) {
  //     console.log(err);
  //     res.status(500).send("Internal Server Error");
  //     }
  // }
  try {
    const profile = await Profile.findById(req.user.profiles[0]._id);
    const post = await Post.findById(req.params.id);

    console.log("this is profile._id : ", profile._id);
    console.log("this is post.profile._id : ", post.profile);

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

async function addPhoto(req, res, next) {
  try {
    let result = await streamUpload(req);

    //  goal - upload image data to post doc
    // 1 find the current post
    // 2. create a new object for passing to the array of images
    // 3. update the db with save()
    // 4. redirect

    const post = await Post.findById(req.params.id);
    const newImage = {
      url: result.url,
      description: req.body.description,
      alt: req.body.alt,
    };
    post.images.push(newImage);
    await post.save();
    console.log("testing post", post);

    res.redirect(`/posts/${req.params.id}`);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

function streamUpload(req) {
  return new Promise(function (resolve, reject) {
    let stream = cloudinary.uploader.upload_stream(function (error, result) {
      if (result) {
        console.log(result);
        resolve(result);
      } else {
        reject(error);
      }
    });
    // streamifier is what chunking and stream data to cloudinary -> pipe process ()
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
}
