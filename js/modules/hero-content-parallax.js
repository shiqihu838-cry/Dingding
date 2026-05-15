export function initHeroContentParallax() {
  const hero = document.querySelector('.hero')
  const content = hero?.querySelector('.hero__content')
  if (!hero || !content) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const scrollRate = 0.34
  const maxOffset = 150

  let raf = 0

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

  const update = () => {
    raf = 0

    if (reduce.matches) {
      content.style.removeProperty('--hero-content-y')
      return
    }

    const heroRect = hero.getBoundingClientRect()
    const scrollPastHeroTop = Math.max(-heroRect.top, 0)
    const offset = clamp(scrollPastHeroTop * scrollRate, 0, maxOffset)
    content.style.setProperty('--hero-content-y', `${offset}px`)
  }

  const requestUpdate = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }

  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate, { passive: true })
  reduce.addEventListener('change', requestUpdate)

  update()
}
