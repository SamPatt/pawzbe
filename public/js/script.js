// document.getElementById('google-login').addEventListener('click', function () {
//   document.querySelector('.spinner').style.display = 'block';
//   performAuthentication();
// });

document.addEventListener('DOMContentLoaded', function() {
  try {
    document.querySelectorAll('.async').forEach(function(element) {
        element.addEventListener('click', function() {
            document.querySelector('.spinner').style.display = 'block';
        });
    });
  } catch (err) {
    console.log(err)
  }
});
