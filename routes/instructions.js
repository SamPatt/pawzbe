var express = require('express');
var router = express.Router();
var instructionsCtrl = require('../controller/instructions')

router.post('/:id/instructions', instructionsCtrl.create)


module.exports = router;