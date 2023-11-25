var express = require('express');
var router = express.Router();
var usersCtrl = require('../controller/users')


// router.get('/', usersCtrl.index)
router.post('/', usersCtrl.create)
router.delete('/', usersCtrl.delete)
router.get('/:id', usersCtrl.show)

module.exports = router;