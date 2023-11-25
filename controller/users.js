const User = require("../models/user");

module.exports = {
  create,
  showSignUp,
  createSignUp,
  showLogIn,
  logIn
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



// <!-- ADDED BY ELLIE -->
// this is only for signup
function showSignUp(req, res){
  res.send("user to see the sign up page")
  //res.render("users/email/signup")
}
async function createSignUp(req, res){
  try{const newUserSignUp = await NewUser({
    email: req.body.email,
    password: req.body.password
  })
  NewUser.save()
  res.redirect('/profile/new')
  }catch(err){
    console.log(err)
  }
}

//after hitting login with email button:
function showLogIn(req, res){
  res.render("users/email/login")
}
//after form submitted by the user:
async function logIn(req, res){
  try{
    const foundUser = User.findOne({email: req.body.email})
    if (foundUser.password === req.body.password){
      res.redirect(`/profiles/${req.params.id}`)
    }
  }
  catch(err){
    console.log(err)
  }
}
// <!-- ADDED BY ELLIE -->