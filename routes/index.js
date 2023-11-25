var express = require('express');
var router = express.Router();
const passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Welcome'});
});


router.get('/auth/github', passport.authenticate(
  'github',
  {
    scope: ['profile', 'email'],
  }
))

router.get('/github/oauth2callback', passport.authenticate(
  'github',
  {
    successRedirect: '/profiles/new',
    failureRedirect: '/',
  }
))

router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'],
  }
))

router.get('/google/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/profiles/new',
    failureRedirect: '/',
  }
))

router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/')
  })
})

module.exports = router;
