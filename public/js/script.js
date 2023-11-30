
document.addEventListener('DOMContentLoaded',() => {
  try {
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

  sidebarButton.addEventListener('click', () => {
    sidebarButton.classList.toggle('hidden')
    sidebarFeed.classList.toggle('hidden')
  })

  postButton.addEventListener('click', () => {
    postButton.classList.toggle('hidden')
    postPartial.classList.toggle('hidden')
  })

});

