# pawzbe Code Highlights
![Login](https://i.imgur.com/KY9N8mg.png)

# Profile Model
<br>

- The profile model contains the profile associated to a specific user, referenced by the user.
```js
[model/user.js]

profiles: [{
  type: Schema.Types.ObjectId,
  ref: "Profile"
}],
```
<br>

- The model holds profile information and files within the main object and separates the pet specific details into it's own sub-object
- The `images` property contains Cloudinary references

```js
model/profile.js

const profileSchema = new Schema(
  {
    petName: {
      type: String,
      required: true,
    },
    humanNames: {
      type: [String],
      required: true,
    },
    petPhoto: {
      profilePhoto: String,
      banner: String,
    },
    petDetails: {
      bio: String,
      favoriteToys: [String],
      breed: String,
      animalType: String,
      age: Number,
    },
    images: []
  },
  { timestamps: true }
);

```
# EJS Highlights
<br>

### Like Button
- A variable is created in EJS to provide the proper Bootstrap class based on if the user has liked a specific comment

```js
profiles/show.ejs, posts/index.ejs

<% const userHasLiked = post.likingUserProfileId.includes(user.profiles[0]._id.toString()) ? 'btn-primary-green' : 'btn-outline-secondary'; %>
<div class="d-flex justify-content-end mt-2">
  <form action="/posts/<%= post._id %>/likes" method="POST">
    <input type="hidden" name="likingUserprofileId" value="<%= post.likingUserprofileId %> ">
    <button type="submit" 
            class="async btn <%= userHasLiked %>">
      <span class="like-count">
        <%= post.likes%> Likes
      </span>
    </button>
  </form>
  <button class="btn btn-outline-secondary" onclick="toggleComments('<%= post._id %>')">            
      <%= post.postComments.length %> Comments
  </button>
</div>
```
<br>

### Image Uploads
- Utilizing Multer and Streamifier, a user is able to upload multiple pictures to their profile gallery
```js
profiles/show.ejs

<% if (owner) { %>
  <div class="container mt-2">
    <form
      class="profile-form d-flex flex-row"
      action="/profiles/<%= user._id %>?_method=PUT"
      method="POST"
      autocomplete="off" 
      enctype="multipart/form-data"
    >
      <div class="row w-100">
        <div class="col-10">
          <div class="form-group">
            <label for="imageUpload">Upload Images</label>
            <input
              type="file"
              class="form-control-file"
              id="imageUpload"
              name="images"
              multiple
              required
            />
            <small class="form-text text-muted">You can select multiple images.</small>
          </div>
        </div>
        <div class="col-2">
          <button class="async add-images-btn btn btn-primary font-weight-bold">+</button>
        </div>
      </div>
    </form>
  </div>
<% } %>
```
<br>

### Header
- The header logo link, user image, and options available are determined by user/profile based conditions
```js
partials/header.js

<div class="nav-item dropdown">
  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <div class="login-circle user-icon">
      <% if (user) { %>
        <img src="<%= user.avatar %>" alt="Profile Image">
        <% } else { %>
        <img src="/images/anon.svg" alt="Profile Image">
      <% } %>
    </div>
  </a>
  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
    <% if (user) { %>
      <small>Welcome, <%= user.name %>!</small>
      <div class="dropdown-divider"></div>
      <% if (user.profiles[0]) { %>
        <a class="async dropdown-item" href="/profiles/<%= user.profiles[0]._id %>">View Profile</a>
        <div class="dropdown-divider"></div>
      <% } %>
      <a class="async dropdown-item" href="/logout">Log Out</a>
      <a class="async dropdown-item" href="/users/<%= user._id %>">User Settings</a>
    <% } else { %>
      <a class="async dropdown-item" href="/auth/google">Log In - Google</a>
      <a class="async dropdown-item" href="/auth/github">Log In - GitHub</a>
    <% } %>
  </div>
</div>
```
# Profiles Controller

`see controllers/profiles.js`

