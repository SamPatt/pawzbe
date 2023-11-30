
const sidebarButton = document.querySelector('.sidebar-button')
const sidebarFeed = document.querySelector('.feed')

sidebarButton.addEventListener('click', () => {
  sidebarButton.classList.toggle('hidden')
  sidebarFeed.classList.toggle('hidden')
})



document.addEventListener('DOMContentLoaded',() => {
  try {
    document.querySelectorAll('.async').forEach((element) => {
        element.addEventListener('click', () => {
            document.querySelector('.spinner').style.display = 'block';
        });
    });
  } catch (err) {
    console.log(err)
  }
});

