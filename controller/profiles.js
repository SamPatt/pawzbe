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
    const profile = await Profile.findById(req.params.id);
    res.render("fuzzies/profiles/show", {
      title: profile.petName,
      profile: profile,
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
  res.render("fuzzies/profile/new", { title: "Make Profile" });
}
async function create(req, res) {
  try {
    const profile = await Profile.create(req.body);
    res.redirect(`/profiles/${req.params.id}`);
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
