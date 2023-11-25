var express = require("express");
var router = express.Router();
var usersCtrl = require("../controller/users");

//router.get('/', usersCtrl.index)
router.post("/", usersCtrl.create);

// <!-- ADDED BY ELLIE -->

//router to receive post request from signup from
//this step comes before creating profile
router.get("/signup", usersCtrl.showSignUp);
router.post("/signup", usersCtrl.createSignUp);

//router to receive post request from login from
router.get("/login", usersCtrl.showLogIn);
router.post("/login", usersCtrl.logIn);

// <!-- ADDED BY ELLIE -->

module.exports = router;
