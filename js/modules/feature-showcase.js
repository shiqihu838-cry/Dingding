/**
 * 每个 [data-feature-showcase] 区块内：悬停 / 聚焦 / 点击卡片切换预览图，并同步 .is-active。
 */
export function initFeatureShowcases() {
  const sections = document.querySelectorAll('[data-feature-showcase]')
  if (!sections.length) return

  sections.forEach((section) => {
    const img = section.querySelector('[data-feature-preview]')
    const cards = [...section.querySelectorAll('[data-preview-src]')]
    if (!img || !cards.length) return
    const frame = img.closest('.feature-showcase__frame')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let switchTimer = 0

    const setActive = (card) => {
      if (!card || !cards.includes(card)) return
      const src = card.dataset.previewSrc
      if (src && img.getAttribute('src') === src && card.classList.contains('is-active')) return

      cards.forEach((c) => {
        const on = c === card
        c.classList.toggle('is-active', on)
        c.setAttribute('aria-pressed', on ? 'true' : 'false')
      })

      const alt = card.dataset.previewAlt
      clearTimeout(switchTimer)

      if (!src) {
        if (typeof alt === 'string') img.alt = alt
        return
      }

      if (reduce.matches || !frame) {
        img.src = src
        if (typeof alt === 'string') img.alt = alt
        return
      }

      frame.querySelectorAll('.feature-showcase__preview-ghost').forEach((ghost) => ghost.remove())

      const ghost = img.cloneNode(false)
      ghost.removeAttribute('data-feature-preview')
      ghost.alt = ''
      ghost.setAttribute('aria-hidden', 'true')
      ghost.className = 'feature-showcase__preview feature-showcase__preview-ghost'
      ghost.style.width = `${img.offsetWidth}px`
      ghost.style.height = `${img.offsetHeight}px`
      frame.append(ghost)

      img.classList.add('is-entering')
      img.src = src
      if (typeof alt === 'string') img.alt = alt

      const reveal = () => {
        requestAnimationFrame(() => {
          ghost.classList.add('is-fading')
          img.classList.remove('is-entering')
        })
      }

      if (img.complete) {
        reveal()
      } else {
        img.addEventListener('load', reveal, { once: true })
      }

      switchTimer = window.setTimeout(() => {
        ghost.remove()
      }, 760)
    }

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => setActive(card))
      card.addEventListener('focus', () => setActive(card))
      card.addEventListener('click', () => setActive(card))
    })

    setActive(cards[0])
  })
}
