var express = require('express');
var router = express.Router();
var usersCtrl = require('../controller/users')


// router.get('/', usersCtrl.index)
router.post('/', usersCtrl.create)


module.exports = router;