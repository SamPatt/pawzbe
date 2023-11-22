const Profile = require("../models/profile");

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
    //const profile = await Profile.findById(req.params.id);
    console.log("test show fn in profiles controller")
    //res.send(" this is profile show view")
    res.render("fuzzies/profiles/show", {
      //title: profile.petName,
      title: "profile.petName",
      //profile: profile,
    });
  } catch (err) {
    console.log(err);
  }
}

async function edit(req, res) {
  try {
    const profile = await Profile.findById(req.params.id);
    res.render("fuzzies/profiles/edit", {
      title: profile.petName,
      profile: profile,
    });
  } catch (err) {
    console.log(err);
  }
}

async function update(res, req) {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.redirect(`/profiles/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
}

function newProfile(req, res) {
  console.log("testing newProfile fn in controller")
  res.render("fuzzies/profiles/new", { title: "Make Profile" });
}


async function create(req, res) {
  let pet = {}
  let petDetails = {}
  try {
    with (req.body) {
      pet.petName = petName
      pet.humanNames = owners.split(',').map(i => i.trim())
      pet.petPhoto = profilePhoto
      pet.petDetails = {
        bio: bio,
        favoriteToys: favoriteToys.split(',').map(i => i.trim()),
        breed: breed,
        animalType: animalType,
        dob: dob,
      }
      pet.images = images.split(',').map(i => i.trim())
    }

    const profile = await Profile.create(pet);
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
