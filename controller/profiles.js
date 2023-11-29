const Profile = require("../models/profile");
const User = require("../models/user");
const Post = require("../models/post");
module.exports = {
  show,
  edit,
  update,
  new: newProfile,
  create,
  delete: deleteProfile,
};

async function show(req, res) {
  try {
    
    console.log("Called show function with ID:", req.params.id);
    const currentProfile = req.params.id;
    const profile = await Profile.findById(req.params.id);
    
    const owner = (req.user.profiles[0]._id.toString() === req.params.id) ? true : false
    const profiles = res.locals.profiles

    if (!profile) {
      console.log("Profile not found for ID:", req.params.id);
      return res.status(404).send('Profile not found');
    }

    const dogBreeds = res.locals.dogBreeds;
    const catBreeds = res.locals.catBreeds;

    let breedInfo = null;

    if (profile.petDetails.breed) {
      const breedName = profile.petDetails.breed;
      const animalType = profile.petDetails.animalType;

      if (animalType === "Dog") {
        const breedData = dogBreeds.find(breed => breed.name === breedName);
        if (breedData) {
          breedInfo = breedData.temperament;
        }
      } else if (animalType === "Cat") {
        const breedData = catBreeds.find(breed => breed.name === breedName);
        if (breedData) {
          breedInfo = breedData.description;
        }
      }
    }

    const posts = await Post.find({ profile: profile._id });

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
    res.status(500).send('Internal Server Error');
  }
}



async function edit(req, res) {
  try {

    const user = await User.findById(req.user._id)
    const profile = await Profile.findById(user.profiles[0])
    const profiles = res.locals.profiles

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
    
    if (req.body.images) {
      const links = req.body.images.split(',').map(i => i.trim())
      profile.images.push(...links)

      await Profile.findOneAndUpdate(
        { _id: profile._id },
        { $set: profile }
      )
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
      
      res.redirect(`/profiles/${profile._id}`)

      // res.render('fuzzies/profiles/show', {
      //   title: 'Pet Added',
      //   profile: profile,
      //   posts: posts,
      //   profiles,
      //   owner,
      //   breedInfo, 
      //   currentProfile,
      // });

    } else if (req.body.deleteImage) {
      try {
        const owner = (req.user.profiles[0]._id.toString() === req.params.id) ? true : false
        const profile = await Profile.findById( req.params.id );
        profile.images.splice(profile.images.indexOf(req.body.deleteImage), 1)
        console.log(profile.images)
        
        await Profile.findOneAndUpdate(
          { _id: profile._id },
          { $set: profile }
        )

        res.render('fuzzies/profiles/edit', {
          title: 'Profile Updated!',
          profile: profile,
          posts: posts,
          profiles,
          owner,
        });

      } catch (err) {
        console.log(err);
      }
    } else {
      const updatedProfile = {}
      let pet = {
        petPhoto: {},
        // images:[],
      }
      const user = await User.findById(req.user._id)
      
      try {
        with (req.body) {
          pet.petName = petName
          pet.humanNames = owners.split(',').map(i => i.trim())
          pet.petPhoto.banner = banner
          pet.petPhoto.profilePhoto = profilePhoto
          pet.petDetails = {
            bio: bio,
            favoriteToys: favoriteToys.split(',').map(i => i.trim()),
            breed: breed,
            animalType: animalType,
            dob: dob,
          }
          // pet.images = [...images.split(',').map(i => i.trim())]
        }

        await Profile.findOneAndUpdate(
          { _id: profile._id },
          { $set: pet }
        )

        res.redirect(`/profiles/${profile._id}/edit`)
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
  const dogBreedNames = dogBreeds.map(breed => breed.name);
  const catBreedNames = catBreeds.map(breed => breed.name);

  res.render("fuzzies/profiles/new", { 
    title: "Make Profile", 
    user: req.user, 
    profiles, 
    dogBreeds: dogBreedNames, 
    catBreeds: catBreedNames
  });
}



async function create(req, res) {
  let pet = {
    petPhoto: {},
    // images:[],
  }
  const user = await User.findById(req.user._id)
  if(req.body.animalTypeOther){
    req.body.animalType = req.body.animalTypeOther
  }
  
  try {
    with (req.body) {
      pet.petName = petName
      pet.humanNames = owners.split(',').map(i => i.trim())
      pet.petPhoto.banner = banner
      pet.petPhoto.profilePhoto = profilePhoto
      pet.petDetails = {
        bio: bio,
        favoriteToys: favoriteToys.split(',').map(i => i.trim()),
        breed: breed,
        animalType: animalType,
        dob: dob,
      }
      // pet.images = [...images.split(',').map(i => i.trim())]
    }

    const profile = await Profile.create(pet)
    user.profiles.push(profile._id)
    await user.save()
    res.redirect(`/profiles/${profile._id}`)
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
