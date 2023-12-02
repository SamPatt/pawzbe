var express = require("express");
var router = express.Router();
const passport = require("passport");
const User = require("../models/user");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Welcome", disabled: true });
});

// GET initiate GitHub authentication
router.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["profile", "email"],
  })
);

// GET GitHub authentication callback
router.get(
  "/github/oauth2callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async function (req, res) {
    try {
      // Check if user profile exists
      const user = await User.findOne({ _id: req.user._id });

      if (user.profiles.length > 0) {
        // Profile exists, redirect to profile page
        return res.redirect(`/profiles/${user.profiles[0]}`);
      } else {
        // Profile doesn't exist, redirect to new profile page
        return res.redirect("/profiles/new");
      }
    } catch (err) {
      // Handle any errors that occur
      console.error(err);
      return res.redirect("/error");
    }
  }
);

// GET initiate Google authentication
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// GET Google authentication callback
router.get(
  "/google/oauth2callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async function (req, res) {
    try {
      // Check if user profile exists
      const user = await User.findOne({ _id: req.user._id });

      if (user.profiles.length > 0) {
        // Profile exists, redirect to profile page
        return res.redirect(`/profiles/${user.profiles[0]}`);
      } else {
        // Profile doesn't exist, redirect to new profile page
        return res.redirect("/profiles/new");
      }
    } catch (err) {
      // Handle any errors that occur
      console.error(err);
      return res.redirect("/error");
    }
  }
);

// GET handle logging out
router.get("/logout", function (req, res) {
  req.logout(function () {
    res.redirect("/");
  });
});

module.exports = router;
