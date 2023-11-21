var express = require('express');
var router = express.Router();
var recipesCtrl = require('../controller/recipes');
var instructionsCtrl = require('../controller/instructions')


/* GET users listing. */
router.get('/', recipesCtrl.index)

router.get('/new', recipesCtrl.new)

router.get('/:id', recipesCtrl.show)

router.post('/', recipesCtrl.create)

router.delete('/:id', recipesCtrl.delete)

router.get('/:id/edit', recipesCtrl.edit)

router.put('/:id', recipesCtrl.update)



module.exports = router;