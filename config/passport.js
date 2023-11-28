const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user')

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await User.findOne({ authId: profile.id });
        if (user) return cb(null, user);

        user = await User.create({
          name: profile.displayName,
          authId: profile.id,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await User.findOne({ authId: profile.id })
        if (user) return cb(null, user)

        user = await User.create({
          name: profile.displayName || profile.username,
          authId: profile.id,
          email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
          avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
        })
        return cb(null, user)
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser(function(user, cb){
  cb(null, user._id)
})

passport.deserializeUser(async function(user, cb) {
  cb(null, await User.findById(user))
})