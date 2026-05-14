export function initHeroVideoScale() {
  const zone = document.querySelector('[data-hero-video-scroll-zone]')
  const sticky = document.querySelector('[data-hero-video-sticky]')
  const target = sticky?.querySelector('[data-video-wrap]')
  if (!zone || !sticky || !target) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const initialWidthRem = 45
  const maxWidthRem = 62
  const scrollSpanVh = 0.95
  const easeStrength = 0.095

  let raf = 0
  let currentScale = null
  let targetScale = 1
  let isAnimating = false

  const remPx = () =>
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

  const setStickyHalfVar = () => {
    const height = target.offsetHeight || sticky.offsetHeight
    sticky.style.setProperty('--hero-video-half', `${height * 0.5}px`)
  }

  const centerOffset = () =>
    parseFloat(getComputedStyle(zone).getPropertyValue('--hero-video-center-offset')) || 0

  const calculateTargetScale = () => {
    raf = 0
    setStickyHalfVar()

    if (reduce.matches) {
      return 1
    }

    const stickyWidth = sticky.offsetWidth
    const maxWidth = Math.min(Math.max(window.innerWidth - 32, 320), maxWidthRem * remPx())
    const initialWidth = Math.min(maxWidth, initialWidthRem * remPx())
    const minScale = stickyWidth > initialWidth ? initialWidth / stickyWidth : 1
    const cappedMaxScale = stickyWidth > maxWidth ? maxWidth / stickyWidth : 1

    const viewportCenter = window.innerHeight * 0.5 + centerOffset()
    const zoneRect = zone.getBoundingClientRect()
    const zonePaddingTop =
      parseFloat(getComputedStyle(zone).paddingTop) || 0
    const targetHalf = (target.offsetHeight || sticky.offsetHeight) * 0.5
    const naturalVideoCenter = zoneRect.top + zonePaddingTop + targetHalf

    const distancePastCenter = viewportCenter - naturalVideoCenter
    const progress = clamp(distancePastCenter / (window.innerHeight * scrollSpanVh), 0, 1)
    const eased = progress * progress * (3 - 2 * progress)

    return minScale + eased * (cappedMaxScale - minScale)
  }

  const render = () => {
    isAnimating = false

    if (reduce.matches) {
      currentScale = 1
      target.style.transform = 'none'
      return
    }

    if (currentScale === null) currentScale = targetScale

    currentScale += (targetScale - currentScale) * easeStrength
    if (Math.abs(targetScale - currentScale) < 0.001) currentScale = targetScale

    target.style.transform = `scale(${currentScale})`

    if (currentScale !== targetScale) {
      isAnimating = true
      requestAnimationFrame(render)
    }
  }

  const update = () => {
    targetScale = calculateTargetScale()
    if (currentScale === null) currentScale = targetScale

    if (!isAnimating) {
      isAnimating = true
      requestAnimationFrame(render)
    }
  }

  const requestUpdate = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }

  const observer = new ResizeObserver(requestUpdate)
  observer.observe(target)
  observer.observe(sticky)

  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate, { passive: true })
  reduce.addEventListener('change', requestUpdate)

  update()
}
