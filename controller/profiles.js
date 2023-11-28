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
    const profile = await Profile.findById(req.params.id);
    const owner = (req.user._id === req.params.id) ? true : false
    const profiles = res.locals.profiles

    if (!profile) {
      console.log("Profile not found for ID:", req.params.id);
      // Handle the not-found case here
      return res.status(404).send('Profile not found');
    }
    
    const posts = await Post.find({ profile: profile._id });

    res.render("fuzzies/profiles/show", {
      title: profile.petName + "'s Page",
      profile: profile,
      posts: posts,
      owner: owner,
      profiles,
    });
  } catch (err) {
    console.log("Error in show function:", err);
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
    
    const user = await User.findById(req.user._id)
    const profile = await Profile.findById(user.profiles[0])
    const posts = await Post.find({ profile: profile._id })
    const profiles = res.locals.profiles

    if (req.body.images) {
      
      const links = req.body.images.split(',').map(i => i.trim())
      profile.images.push(...links)

      console.log(profile._id)

      await Profile.findOneAndUpdate(
        { _id: profile._id },
        { $set: profile }
      );
      
    } else {
      // update profile

      // const profile = await Profile.findOneAndUpdate(
      //   { _id: req.params.id },
      //   { $set: req.body }
      // );
    }


    res.render('fuzzies/profiles/show', {
      title: 'Pet Added',
      profile: profile,
      posts: posts,
      profiles,
    });

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
  console.log(catBreedNames)
  console.log(dogBreedNames)

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
