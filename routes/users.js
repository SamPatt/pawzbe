var express = require("express");
var router = express.Router();
var usersCtrl = require("../controller/users");

// POST create new user
router.post("/", usersCtrl.create);
// PUT update user details
router.put("/:id", usersCtrl.update);
// DELETE delete user
router.delete("/", usersCtrl.delete);
// GET render user view
router.get("/:id", usersCtrl.show);

module.exports = router;
