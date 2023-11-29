var express = require("express");
var router = express.Router();
var profilesCtrl = require("../controller/profiles");

// router.get("/", profilesCtrl.show);
router.post("/", profilesCtrl.create);

router.get("/new", profilesCtrl.new);
router.get("/:id", profilesCtrl.show);

router.put("/:id", profilesCtrl.update);
router.delete("/:id", profilesCtrl.delete);
router.get("/:id/edit", profilesCtrl.edit);

router.post("/:id/likes", profilesCtrl.like);
module.exports = router;
