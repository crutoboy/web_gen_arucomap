const darkModeMql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
const themeSwitch = document.getElementById('darkModeSwitch')

let isDarkMode = localStorage.getItem('genmap_dark_mode')

function enable_dark_mode(is) {
  if (is) {
    themeSwitch.checked = true
    localStorage.setItem('genmap_dark_mode', true)
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else {
    themeSwitch.checked = false
    localStorage.setItem('genmap_dark_mode', false)
    document.documentElement.setAttribute('data-bs-theme', 'light')
  }
}

enable_dark_mode(isDarkMode === "true" || (isDarkMode === null && darkModeMql && darkModeMql.matches))

themeSwitch.addEventListener('click', () => {
  enable_dark_mode(themeSwitch.checked)
})