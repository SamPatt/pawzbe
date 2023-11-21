const Recipe = require ('../models/recipe')

module.exports = {
  new: newRecipe,
  create,
  index,
  show,
  delete: deleteRecipe,
  edit,
  update: updateRecipe
};

async function edit(req, res) {
    const recipe = await Recipe.findById(req.params.id)
    res.render('recipes/edit', { title: 'Editing', recipe })
}

async function index(req, res) {
    
    try {
        const recipes = await Recipe.find()
        
        res.render('recipes/index', {title: "All Recipes", recipes})
    } catch (err) {
        console.log(err)
    }

}

function newRecipe(req, res) {
  res.render("recipes/new", {title: 'Editing'});
  //res.send('new')
}

async function create(req, res) {
    try{
        req.body.ingredients = req.body.ingredients.split(',').map(i => i.trim())
        const newRecipe = await Recipe.create(req.body);
        res.redirect('/recipes/')

    }catch(err){
        console.log(err)

    }
}

async function show(req, res) {
try {

    const recipe = await Recipe.findById(req.params.id)
    console.log(recipe.steps)

    res.render('recipes/show', {
        title: 'Recipe',
        recipe
    })
} catch (err){
    console.log(err)
}

}

async function deleteRecipe(req, res){
    try{
        await Recipe.deleteOne({_id: req.params.id})
        res.redirect('/recipes')
    }catch(err){
        console.log(err)
    }
}

async function updateRecipe(req, res){
    console.log(req.params.id)
    console.log(req.body)
    try{
        const recipe = await Recipe.findOneAndUpdate({_id: req.params.id}, {$set: req.body})
        res.redirect(`/recipes/${req.params.id}`)

    } catch(err){
        console.log(err)
    }
}