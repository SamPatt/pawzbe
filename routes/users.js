var express = require('express');
var router = express.Router();
var usersCtrl = require('../controller/users')


router.post('/', usersCtrl.create)
router.put('/:id', usersCtrl.update)
router.delete('/', usersCtrl.delete)
router.get('/:id', usersCtrl.show)

module.exports = router;