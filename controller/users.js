const User = require("../models/user");

module.exports = {
  create,
  delete: deleteUser,
};

async function deleteUser(req, res) {
  const output = await User.findByIdAndDelete(req.user._id)
  console.log('REQ:', req.user)
  console.log('REQ ID:', req.user.id)
  console.log('OUT:', output)
  req.logout(function() {
    res.redirect('/')
  })
}

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    await user.save();

    res.redirect("/profiles/new");
  } catch (err) {
    console.log(err);
  }
}
