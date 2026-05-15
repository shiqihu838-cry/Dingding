export function initVideo() {
  const wrap = document.querySelector('[data-video-wrap]')
  if (!wrap) return

  const video = wrap.querySelector('video')
  if (!video) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  let hasRequestedPlay = false

  const startMutedAutoplay = () => {
    if (reduce.matches) {
      video.pause()
      return
    }
    if (hasRequestedPlay) return
    hasRequestedPlay = true
    video.muted = true
    video.autoplay = true
    video.preload = 'auto'
    void video.play().catch(() => {
      hasRequestedPlay = false
    })
  }

  startMutedAutoplay()

  if (video.readyState < 2) {
    video.addEventListener('loadeddata', startMutedAutoplay, { once: true })
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        startMutedAutoplay()
        io.disconnect()
      },
      { rootMargin: '35% 0px' },
    )
    io.observe(wrap)
  }

  reduce.addEventListener('change', startMutedAutoplay)

  wrap.querySelector('[data-video-play]')?.addEventListener('click', () => {
    void video.play()
  })

  wrap.querySelector('[data-video-pause]')?.addEventListener('click', () => {
    video.pause()
  })
}
