var express = require('express');
var router = express.Router();
var usersCtrl = require('../controller/users')


router.get('/users', usersCtrl.new)
router.post('/users', usersCtrl.create)


module.exports = router;