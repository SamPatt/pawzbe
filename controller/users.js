const User = require("../models/user");

module.exports = {
  create,
};

async function create(req, res) {
  try {
    const newUser = await User.create(req.body);
    await user.save();
    // Make sure OAuth work here before redirecting to new profile
    res.redirect("/profiles/new");
  } catch (err) {
    console.log(err);
  }
}
