const Post = require ('../models/post')
const Profile = require ('../models/profile')

module.exports = {
    index,
    show,
    delete: deletePost,
    addComment,
    create
  
};

async function index(req, res) {
    
    try {
        const posts = await Post.find()
        
        res.render('fuzzies/posts/index', {
            title: "All Posts", 
            posts: posts    
        })
    } catch (err) {
        console.log(err)
    }

}

async function create(req, res) {
    try {
        
        req.body.profile = req.user.profiles[0]._id
        const profile = await Profile.findById(req.user.profiles[0]._id)
        req.body.petName = profile.petName
        req.body.profilePhoto = profile.petPhoto.profilePhoto
        const post = await Post.create(req.body)
        console.log(post)

        res.redirect("/posts/")

    } catch (err) {
        console.log(err)
    }
    
}

async function show(req, res){
    try{
        const post = await Post.findById(req.params.id)
        res.render('fuzzies/posts/show', {
            title: post.petName,
            post: post,
        })
    } catch(err) {
        console.log(err)
    }
}

async function addComment(req, res) {
    try{
       const post = await Post.findById(req.params.id)
       post.postComments.push(req.body)
       await post.save()
       res.render('fuzzies/posts/show', {
        title: post.petName,
        post: post,
    })

    }catch(err){
        console.log(err)

    }
}


async function deletePost(req, res){
    try{
        const post = await Post.deleteOne({_id: req.params.id})
        res.redirect(`/profile/${post.profile}`)
    }catch(err){
        console.log(err)
    }
}