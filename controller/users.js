const User = require("../models/user");

module.exports = {
  create,
  delete: deleteUser,
};

async function deleteUser(req, res) {
  await User.findByIdAndDelete(req.user._id)
  req.logout(function() {
    res.redirect('/')
  })
}

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    await user.save();
    // Make sure OAuth work here before redirecting to new profile
    res.redirect("/profiles/new");
  } catch (err) {
    console.log(err);
  }
}
