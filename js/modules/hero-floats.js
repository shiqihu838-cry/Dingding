export function initHeroFloats() {
  const floats = [...document.querySelectorAll('[data-hero-float]')]
  if (!floats.length) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  let raf = 0

  const update = () => {
    raf = 0

    const scrollY = reduce.matches ? 0 : window.scrollY
    floats.forEach((node) => {
      const rate = Number(node.dataset.floatRate || 0)
      node.style.setProperty('--float-scroll-y', `${scrollY * rate}px`)
    })
  }

  const requestUpdate = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }

  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate, { passive: true })
  reduce.addEventListener('change', requestUpdate)

  update()
}
