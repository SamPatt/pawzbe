const User = require("../models/user");

module.exports = {
  create,
  delete: deleteUser,
};

async function deleteUser(req, res) {
  const user = await User.find({googleId: req.user.googleId})
  await User.findOneAndDelete({ googleId: user.googleId })
  res.redirect('/')
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
