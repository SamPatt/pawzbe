var express = require("express");
var router = express.Router();
var profilesCtrl = require("../controller/profiles");

router.get("/new", profilesCtrl.new);
router.post("/", profilesCtrl.create);

router.get("/", profilesCtrl.show);
router.get("/:id", profilesCtrl.show);

router.get("/:id/edit", profilesCtrl.edit);
router.put("/:id", profilesCtrl.update);


router.delete("/:id", profilesCtrl.delete);

module.exports = router;
