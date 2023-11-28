const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const session = require('express-session')
const passport = require('passport')
const Profile = require('./models/profile')
const fetch = require("node-fetch");


require("dotenv").config();
require("./config/database");
require("./config/passport")

const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const profilesRouter = require("./routes/profiles");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(async function(req, res, next) {
  res.locals.user = req.user
  try {
    res.locals.dogBreeds = await getDogBreeds()
    res.locals.catBreeds = await getCatBreeds()
    res.locals.profiles = await Profile.find()
    next()
  } catch (error) {
    console.error(error)
    res.locals.profiles = []
    next()
  }
   async function getDogBreeds(){
      const URL = `https://api.thedogapi.com/v1/breeds`;
    
      const config = {
        method: "GET",
        headers: {
          'x-api-key': process.env.BREED_API_KEY
        }
      };
    
      try {
        const apiResponse = await fetch(URL, config);
        
        if (apiResponse.status >= 400) {
          throw Error("API error");
        }
        
        const apiData = await apiResponse.json();
        return apiData;
      } catch (err) {
        console.log(err.message);
      }
    }
    async function getCatBreeds(){
      const URL = `https://api.thecatapi.com/v1/breeds`;
    
      const config = {
        method: "GET",
        headers: {
          'x-api-key': process.env.BREED_API_KEY
        }
      };
    
      try {
        const apiResponse = await fetch(URL, config);
        
        if (apiResponse.status >= 400) {
          throw Error("API error");
        }
        
        const apiData = await apiResponse.json();
        return apiData;
      } catch (err) {
        console.log(err.message);
      }
    }
})

app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/profiles", profilesRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "Editing" });
});

module.exports = app;