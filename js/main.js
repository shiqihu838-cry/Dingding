import { initNav } from './modules/nav.js'
import { initScrollReveal } from './modules/scroll-reveal.js'
import { initSceneCardsReveal } from './modules/scene-cards-reveal.js'
import { initFeatureShowcases } from './modules/feature-showcase.js'
import { initVideo } from './modules/video.js'
import { initHeroVideoScale } from './modules/hero-video-scale.js'
import { initHeroFloats } from './modules/hero-floats.js'
import { initHeroContentParallax } from './modules/hero-content-parallax.js'

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initVideo()
  initHeroFloats()
  initHeroContentParallax()
  initHeroVideoScale()
  initScrollReveal()
  initSceneCardsReveal()
  initFeatureShowcases()
})
