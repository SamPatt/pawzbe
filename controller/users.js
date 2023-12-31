const User = require("../models/user");

module.exports = {
  create,
  delete: deleteUser,
  show,
  update,
};

// update user info based on form data
async function update(req, res) {
  try {
    const updatedData = {};
    updatedData.name = req.body.name || req.user.name;
    updatedData.email = req.body.email || req.user.email;
    updatedData.avatar = req.body.avatar || req.user.avatar;

    await User.findOneAndUpdate({ _id: req.user._id }, { $set: updatedData });

    res.redirect(`/users/${req.user._id}`);
  } catch (err) {
    console.log(err);
  }
}

// render user details/editing page
async function show(req, res) {
  const userData = await User.findById(req.params.id).populate("profiles");
  const profiles = res.locals.profiles;

  res.render("fuzzies/users/show", {
    title: "User Settings",
    user: userData,
    profiles,
  });
}

// handle user deletion
async function deleteUser(req, res) {
  try {
    const output = await User.findByIdAndDelete(req.user._id);
    req.logout(function () {
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
}

// handle user creation
async function create(req, res) {
  try {
    const user = await User.create(req.body);
    await user.save();

    res.redirect("/profiles/new");
  } catch (err) {
    console.log(err);
  }
}
