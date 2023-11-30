var express = require("express");
var router = express.Router();

const multer = require("multer");

// multer - middleware -> code that runs between the inbound request and a server response 
// multer will be used as 'inline middleware' 

const upload = multer()

var postsCtrl = require("../controller/posts");

// for creating a post
router.get("/", postsCtrl.index);
router.post("/", upload.single('imageUpload'), postsCtrl.create);

// for creating a comment
// router.get('/new', postsCtrl.new)
router.post("/:id/comments", postsCtrl.addComment);

router.get("/:id", postsCtrl.show);

router.delete("/:id", postsCtrl.delete);

router.post("/:id/comments", postsCtrl.addComment);
router.delete("/comments/:id", postsCtrl.deleteComment);


router.post("/:id/likes", postsCtrl.like);


module.exports = router;
