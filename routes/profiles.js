var express = require("express");
var router = express.Router();
var profilesCtrl = require("../controller/profiles");

const multer = require("multer");

const upload = multer();

// POST create new profile
router.post(
  "/",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  profilesCtrl.create
);

// GET render new profile page
router.get("/new", profilesCtrl.new);

// GET render profile page
router.get("/:id", profilesCtrl.show);

// PUT update profile
router.put(
  "/:id",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "images", maxCount: 6 },
  ]),
  profilesCtrl.update
);

// DELETE delete profile
router.delete("/:id", profilesCtrl.delete);

// GET render edit profile page
router.get("/:id/edit", profilesCtrl.edit);

// POST handle post likes
router.post("/:id/likes", profilesCtrl.like);

module.exports = router;
