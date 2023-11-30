var express = require("express");
var router = express.Router();
var profilesCtrl = require("../controller/profiles");

const multer = require("multer");

// multer - middleware -> code that runs between the inbound request and a server response 
// multer will be used as 'inline middleware' 

const upload = multer()

// router.get("/", profilesCtrl.show);
router.post("/", upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]), profilesCtrl.create);

router.get("/new", profilesCtrl.new);
router.get("/:id", profilesCtrl.show);

router.put("/:id", upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'images', maxCount: 6 } 
  ]), profilesCtrl.update);
  
router.delete("/:id", profilesCtrl.delete);
router.get("/:id/edit", profilesCtrl.edit);


module.exports = router;