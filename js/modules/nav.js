export function initNav() {
  const header = document.querySelector('[data-site-header]')
  const toggle = document.querySelector('[data-nav-toggle]')
  if (!header || !toggle) return

  const setOpen = (open) => {
    header.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  }

  toggle.addEventListener('click', () => {
    setOpen(!header.classList.contains('is-open'))
  })

  header
    .querySelectorAll('#site-nav-mobile a, #site-nav-mobile button')
    .forEach((el) => {
      el.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 1023px)').matches) {
          setOpen(false)
        }
      })
    })

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false)
  })
}
