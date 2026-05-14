import { initNav } from './modules/nav.js'
import { initScrollReveal } from './modules/scroll-reveal.js'
import { initVideo } from './modules/video.js'
import { initHeroVideoScale } from './modules/hero-video-scale.js'
import { initHeroFloats } from './modules/hero-floats.js'

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initVideo()
  initHeroFloats()
  initHeroVideoScale()
  initScrollReveal()
})
