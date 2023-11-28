const User = require("../models/user");

module.exports = {
  create,
  delete: deleteUser,
  show,
  update,
};

async function update(req, res) {
  try {
      const updatedData = {}
    updatedData.name = req.body.name || req.user.name
    updatedData.email = req.body.email || req.user.email
    updatedData.avatar = req.body.avatar || req.user.avatar

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: updatedData }
    )

    res.redirect(`/users/${ req.user._id }`)
  } catch (err) {
    console.log(err)
  }
}

// [
//   {
//     petPhoto: { images: [] },
//     petDetails: {
//       bio: '123',
//       favoriteToys: [Array],
//       breed: 'Shepard',
//       animalType: 'Dog',
//       dob: 2022-01-01T00:00:00.000Z
//     },
//     _id: new ObjectId('6562bbe881bc46424233f1f4'),
//     petName: 'Karl',
//     humanNames: [ 'Tim', 'Steph' ],
//     images: [ '' ],
//     createdAt: 2023-11-26T03:30:48.108Z,
//     updatedAt: 2023-11-26T03:30:48.108Z,
//     __v: 0
//   }
// ]

async function show(req, res) {
  const userData = await User.findById(req.params.id).populate('profiles')
  const profiles = res.locals.profiles

  res.render('fuzzies/users/show', { 
    title: 'User Settings', 
    user: userData,
    profiles,
  })
}

async function deleteUser(req, res) {
  try {
    const output = await User.findByIdAndDelete(req.user._id)
    req.logout(function() {
      res.redirect('/')
    })
  } catch (err) {
    console.log(err)
  }
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
