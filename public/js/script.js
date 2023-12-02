
document.addEventListener('DOMContentLoaded',() => {
  try {
    // display loading indicator on click
    // applies to any element with class 'async'
    document.querySelectorAll('.async').forEach((element) => {
        element.addEventListener('click', (event) => {
          const spinner = document.querySelector('.spinner')
          spinner.style.display = 'block';
        });
    });
  } catch (err) {
    console.log(err)
  }

  const sidebarButton = document.querySelector('.sidebar-button')
  const sidebarFeed = document.querySelector('.feed')
  const postPartial = document.querySelector('.post-partial')
  const postButton = document.querySelector('.post-button')

  // handle side-feed clicks
  sidebarButton.addEventListener('click', () => {
    sidebarButton.classList.toggle('hidden')
    sidebarFeed.classList.toggle('hidden')
  })

  // handle create post clicks
  postButton.addEventListener('click', () => {
    postButton.classList.toggle('hidden')
    postPartial.classList.toggle('hidden')
  })

});

