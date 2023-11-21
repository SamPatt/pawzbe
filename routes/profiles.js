var express = require("express");
var router = express.Router();
var profilesCtrl = require("../controller/profiles");

router.get("/:id", profilesCtrl.show);
router.delete("/:id", profilesCtrl.delete);

router.get("/profiles/:id/edit", profilesCtrl.edit);
router.put("/profiles/:id", profilesCtrl.update);

router.get("/profiles/new", profilesCtrl.new);
router.post("/profiles", profilesCtrl.create);

module.exports = router;
