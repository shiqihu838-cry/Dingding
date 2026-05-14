export function initVideo() {
  const wrap = document.querySelector('[data-video-wrap]')
  if (!wrap) return

  const video = wrap.querySelector('video')
  if (!video) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

  const startMutedAutoplay = () => {
    if (reduce.matches) {
      video.pause()
      return
    }
    video.muted = true
    void video.play().catch(() => {})
  }

  if (video.readyState >= 2) startMutedAutoplay()
  else video.addEventListener('loadeddata', startMutedAutoplay, { once: true })

  reduce.addEventListener('change', startMutedAutoplay)

  wrap.querySelector('[data-video-play]')?.addEventListener('click', () => {
    void video.play()
  })

  wrap.querySelector('[data-video-pause]')?.addEventListener('click', () => {
    video.pause()
  })
}
