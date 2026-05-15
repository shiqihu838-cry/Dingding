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

    const setActive = (card) => {
      if (!card || !cards.includes(card)) return
      cards.forEach((c) => {
        const on = c === card
        c.classList.toggle('is-active', on)
        c.setAttribute('aria-pressed', on ? 'true' : 'false')
      })
      const src = card.dataset.previewSrc
      if (src) img.src = src
      const alt = card.dataset.previewAlt
      if (typeof alt === 'string') img.alt = alt
    }

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => setActive(card))
      card.addEventListener('focus', () => setActive(card))
      card.addEventListener('click', () => setActive(card))
    })

    setActive(cards[0])
  })
}
