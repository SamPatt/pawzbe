const Profile = require("../models/profile");
const User = require("../models/user");
const Post = require("../models/post");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const { clConfig } = require('../config/cloudinary')
cloudinary.config(clConfig)

module.exports = {
  show,
  edit,
  update,
  new: newProfile,
  create,
  delete: deleteProfile,
  addPhoto,
  like,
};

// Display a profile page with posts and relevant information
async function show(req, res) {
  try {
    const profile = await Profile.findById(req.params.id);
    const posts = await Post.find({ profile: profile._id }).sort({ createdAt: -1 });

    const owner = req.user.profiles[0]._id.toString() === req.params.id ? true : false;
    const profiles = res.locals.profiles;

    const dogBreeds = res.locals.dogBreeds;
    const catBreeds = res.locals.catBreeds;
    let breedInfo = null;
  
    if (!profile) {
      return res.status(404).send("Profile not found");
    }

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

    res.render("fuzzies/profiles/show", {
      title: profile.petName + "'s Page",
      profile: profile,
      posts: posts,
      profiles,
      breedInfo,
      owner,
    });

  } catch (err) {
    console.log("Error in show function:", err);
    res.status(500).send("Internal Server Error");
  }
}

// Render the edit profile page
async function edit(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const profile = await Profile.findById(user.profiles[0]);
    const profiles = res.locals.profiles;

    res.render("fuzzies/profiles/edit", {
      title: `Editing ${profile.petName}`,
      profile: profile,
      profiles,
    });
  } catch (err) {
    console.log(err);
  }
}

// Update profile information
async function update(req, res) {
  try {
    // Retrieve user and profile information
    const user = await User.findById(req.user._id);
    const profile = await Profile.findById(user.profiles[0]);
    const dogBreeds = res.locals.dogBreeds;
    const catBreeds = res.locals.catBreeds;

    let breedInfo = null;

    // Check if the profile has a specified breed
    if (profile.petDetails.breed) {
      const breedName = profile.petDetails.breed;
      const animalType = profile.petDetails.animalType;

      // Fetch breed information based on the animal type
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

    // Check if there are new images to upload
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        let result = await streamUpload(file);
        profile.images.push(result.url);
      }

      // Update the profile with new image URLs
      await Profile.findOneAndUpdate(
        { _id: profile._id },
        { $set: profile }
      );

      // Redirect to the profile page
      res.redirect(`/profiles/${profile._id}`);
    }

    // Check if an image needs to be deleted
    if (req.body.deleteImage) {
      try {
        const owner = req.user.profiles[0]._id.toString() === req.params.id ? true : false;
        const profile = await Profile.findById(req.params.id);
        profile.images.splice(profile.images.indexOf(req.body.deleteImage), 1);

        // Update the profile without the deleted image
        await Profile.findOneAndUpdate(
          { _id: profile._id },
          { $set: profile }
        );
      } catch (err) {
        console.log(err);
      }

    } else {
      // Prepare data for updating the profile
      let pet = {
        petPhoto: {
          profilePhoto: '',
          banner: '',
        },
      };

      // Check and update profile photo if provided
      if (req.files && req.files.profilePhoto) {
        let profileImageResult = await streamUpload(req.files.profilePhoto[0]);
        pet.petPhoto.profilePhoto = profileImageResult.url;
      } else {
        pet.petPhoto.profilePhoto = profile.petPhoto.profilePhoto;
      }

      // Check and update banner photo if provided
      if (req.files && req.files.banner) {
        let bannerImageResult = await streamUpload(req.files.banner[0]);
        pet.petPhoto.banner = bannerImageResult.url;
      } else {
        pet.petPhoto.banner = profile.petPhoto.banner;
      }

      try {
        // Update profile information based on user input
        with (req.body) {
          pet.petName = petName;
          pet.humanNames = owners.split(',').map(i => i.trim());
          pet.petDetails = {
            bio: bio,
            favoriteToys: favoriteToys.split(",").map((i) => i.trim()),
            breed: breed,
            animalType: animalType,
            age: age,
          };
        }

        // Update the profile with the new data
        await Profile.findOneAndUpdate({ _id: profile._id }, { $set: pet });

        // Redirect to the updated profile page
        res.redirect(`/profiles/${profile._id}`);
      } catch (err) {
        console.log(err);
      }
    }

  } catch (err) {
    console.log(err);
  }
}

// Render the form to create a new profile
function newProfile(req, res) {
  const profiles = res.locals.profiles;
  const dogBreeds = res.locals.dogBreeds;
  const catBreeds = res.locals.catBreeds;

  // Extract only the names of the breeds
  const dogBreedNames = dogBreeds.map((breed) => breed.name);
  const catBreedNames = catBreeds.map((breed) => breed.name);

  res.render("fuzzies/profiles/new", {
    title: "Make Profile",
    user: req.user,
    profiles,
    dogBreeds: dogBreedNames,
    catBreeds: catBreedNames,
  });
}

// Create a new profile
async function create(req, res) {
  let pet = {
    petPhoto: {
      profilePhoto: '',
      banner: '',
    },
  }
  const user = await User.findById(req.user._id)
  if(req.body.animalTypeOther){
    req.body.animalType = req.body.animalTypeOther
  }

  if (req.files && req.files.profilePhoto) {
    let profileImageResult = await streamUpload(req.files.profilePhoto[0]);
    pet.petPhoto.profilePhoto = profileImageResult.url;
  }

  if (req.files && req.files.banner) {
    let bannerImageResult = await streamUpload(req.files.banner[0]);
    pet.petPhoto.banner = bannerImageResult.url;
  }

  try {
    with (req.body) {
      pet.petName = petName
      pet.humanNames = owners.split(',').map(i => i.trim())
      pet.petDetails = {
        bio: bio,
        favoriteToys: favoriteToys.split(",").map((i) => i.trim()),
        breed: breed,
        animalType: animalType,
        age: age,
      }
    }

    const profile = await Profile.create(pet);
    user.profiles.push(profile._id);
    await user.save();
    res.redirect(`/profiles/${profile._id}`);
  } catch (err) {
    console.log(err);
  }
}

// Delete a profile
async function deleteProfile(req, res) {
  try {
    const profile = await Profile.deleteOne({ _id: req.params.id });
    res.redirect("/profiles/new");
  } catch (err) {
    console.log(err);
  }
}

// Like or unlike a post
async function like(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likingUserProfileId.includes(req.user.profiles[0]._id.toString())
    ) {
      post.likes--;
      post.likingUserProfileId = post.likingUserProfileId.filter(
        (id) => id !== req.user.profiles[0]._id.toString()
      );
    } else {
      post.likes++;
      post.likingUserProfileId.push(req.user.profiles[0]._id.toString());
      req.body.likingUserProfileId = req.user.profiles[0]._id;
    }

    await post.save();
    res.redirect(`/profiles/${post.profile._id}`);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Add a photo to a post
async function addPhoto(req,res,next){
  try {
      let result = await streamUpload(req)      
      const post = await Post.findById(req.params.id)
      const newImage = { url: result.url,  description: req.body.description, alt: req.body.alt}

      post.images.push(newImage)
      await post.save()

      res.redirect(`/posts/${req.params.id}`)

  }catch(err){
      console.log(err)
      next(err)
  }
}

// Helper function for streaming uploads to Cloudinary
function streamUpload (file){
  return new Promise(function (resolve, reject){
      let stream = cloudinary.uploader.upload_stream(function(error, result){
          if(result){
              resolve(result)
          } else {
              reject(error)
          }
      });

      streamifier.createReadStream(file.buffer).pipe(stream)
  })
}