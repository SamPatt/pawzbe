var express = require('express');
var router = express.Router();

var postsCtrl = require('../controller/posts')


// for creating a post
router.get('/', postsCtrl.index)
router.post('/', postsCtrl.index)

// for creating a comment
router.get('/new', postsCtrl.new)
router.post('/:id/comments', postsCtrl.create)


router.get('/:id', postsCtrl.show)



router.delete('/:id', postsCtrl.delete)





module.exports = router;