var express = require("express");
var router = express.Router();

const multer = require("multer");

const upload = multer()

var postsCtrl = require("../controller/posts");


router.get("/", postsCtrl.index);
router.post("/", upload.single('imageUpload'), postsCtrl.create);


router.post("/:id/comments", postsCtrl.addComment);

router.get("/:id", postsCtrl.show);

router.delete("/:id", postsCtrl.delete);

router.post("/:id/comments", postsCtrl.addComment);
router.delete("/comments/:id", postsCtrl.deleteComment);


router.post("/:id/likes", postsCtrl.like);


module.exports = router;
