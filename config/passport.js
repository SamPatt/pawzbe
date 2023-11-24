const passport = require('passport')


const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
  },
  async function(accessToken, refreshToken, profile, cb) {
    
  }
))