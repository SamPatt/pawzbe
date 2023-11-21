const Recipe = require ('../models/post')

module.exports = {
  create,
}

async function create(req, res) {
  try{
    const recipe = await Recipe.findById(req.params.id)
    recipe.steps.push(req.body)
    await recipe.save()
    
    res.redirect(`/recipes/${req.params.id}`)

  }catch(err){
      console.log(err)
  }
}
