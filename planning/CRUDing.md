
## Main Path
  - GET '/'

  ## User Register
  - `GET` '/user/register'
    ### View
    - 'views/user/new'
      - `POST` '/user/create'
        - `redirect` '/profile'

  ## User Sign-in
  - `GET` '/user/login' (OAuth)
    ### View
    - '/user/login'
      - `redirect` /main

## Pet Profile View
  - `GET` '/profile'
  ### View
  - '/views/profile'

## Main Feed
  - `GET` '/main'
  - '/posts/:id'


Structure
* controllers
  
* models
  user.js
    pet profiles
  petPost.js (ref user)
    comments

* routes
    users.js
      router.get('/users', usersCtrl.new)
      router.post('/users', usersCtrl.create)

    posts.js
      router.get('/posts', postsCtrl.index)
      router.get('/posts/:id', postsCtrl.show)
      router.delete('/posts/:id', postsCtrl.delete)

    profile.js
      router.get('/profiles/:id', profilesCtrl.show)
      router.delete('/profiles/:id', profilesCtrl.delete)

      router.get('/profiles/:id/edit', profilesCtrl.edit)
      router.put('/profiles/:id', profilesCtrl.update)

      router.get('/profiles/new', profilesCtrl.new)
      router.post('/profiles', profilesCtrl.create)

* views
  * user
      new.ejs
  * profile
      new.ejs 
      show.ejs
      edit.ejs
  * posts 
      index.ejs
      show.ejs

  * partials
      header.ejs
      footer.ejs
      pet-profiles.ejs
      add-comment.ejs

  
  users/pets/posts are own model
  comments embedded to posts