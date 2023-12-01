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
  like,
};

async function show(req, res) {
  try {
    const currentProfile = req.params.id;
    const profile = await Profile.findById(req.params.id);

    const owner =
      req.user.profiles[0]._id.toString() === req.params.id ? true : false;
    const profiles = res.locals.profiles;

    if (!profile) {
      return res.status(404).send("Profile not found");
    }

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

    const posts = await Post.find({ profile: profile._id }).sort({ createdAt: -1 });

    res.render("fuzzies/profiles/show", {
      title: profile.petName + "'s Page",
      profile: profile,
      posts: posts,
      profiles,
      breedInfo,
      currentProfile,
      owner,
    });
  } catch (err) {
    console.log("Error in show function:", err);
    res.status(500).send("Internal Server Error");
  }
}

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

async function update(req, res) {
  try {
    const currentProfile = req.params.id;
    const owner = true
    const user = await User.findById(req.user._id)
    const profile = await Profile.findById(user.profiles[0])
    const posts = await Post.find({ profile: profile._id })
    const profiles = res.locals.profiles

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

      if (req.files && req.files.images){
        for (const file of req.files.images) {
  
          let result = await streamUpload(file);
          profile.images.push(result.url);
        }
        await Profile.findOneAndUpdate(
          { _id: profile._id },
          { $set: profile }
        )
        
        res.redirect(`/profiles/${profile._id}`)
      }
  
      


    if (req.body.deleteImage) {
      try {
        const owner = (req.user.profiles[0]._id.toString() === req.params.id) ? true : false
        const profile = await Profile.findById( req.params.id );
        profile.images.splice(profile.images.indexOf(req.body.deleteImage), 1)
        
        await Profile.findOneAndUpdate(
          { _id: profile._id },
          { $set: profile }
        )
      } catch (err) {
        console.log(err);
      }
    } else {
      const updatedProfile = {};
      let pet = {
        petPhoto: {
          profilePhoto: '', 
          banner: '',
        },
      }
      const user = await User.findById(req.user._id)
      

      if (req.files && req.files.profilePhoto) {
        let profileImageResult = await streamUpload(req.files.profilePhoto[0]);
        pet.petPhoto.profilePhoto = profileImageResult.url;
      } else {
        pet.petPhoto.profilePhoto = profile.petPhoto.profilePhoto
      }
    
      if (req.files && req.files.banner) {
        let bannerImageResult = await streamUpload(req.files.banner[0]);
        pet.petPhoto.banner = bannerImageResult.url;
      } else {
        pet.petPhoto.banner = profile.petPhoto.banner;
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
          };
        }

        await Profile.findOneAndUpdate({ _id: profile._id }, { $set: pet });

        res.redirect(`/profiles/${profile._id}`)
    } catch (err) {
      console.log(err);
    }
  }


    

  } catch (err) {
    console.log(err);
  }
}

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

async function deleteProfile(req, res) {
  try {
    const profile = await Profile.deleteOne({ _id: req.params.id });
    res.redirect("/profiles/new");
  } catch (err) {
    console.log(err);
  }
}

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
    res.redirect(`/profiles/${post.profile._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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