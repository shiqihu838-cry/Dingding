/**
 * 「我们支持哪些场景」：卡片随滚动进度 scrub 归位（左右交替），
 * 参考 outcrowd.io 式 scroll-linked 动画；与滚动 1:1，无 CSS transition 抢进度。
 * 卡片晚于标题：用 CARD_GLOBAL_HOLD（原始全局 p）做门槛，勿把「死区」叠在 p/0.72 后。
 * CARD_PHASE_COMPRESS 越小，卡片越早跑满进度（更早结束 scrub）。
 */
const MAX_ROT = 13

/** 全局 p 前多少完全不动（仅卡片）；相对「原始 p」，比 dead 作用在 p/0.72 上更直观 */
const CARD_GLOBAL_HOLD = 0.28
/** 卡片在剩余 (1-hold) 里略压缩时间轴；越小越早满进度（更早「结束」） */
const CARD_PHASE_COMPRESS = 0.62

function clamp01(v) {
  return Math.min(1, Math.max(0, v))
}

/** 与 CSS clamp(3rem, 11vw, 6rem) 同步的水平位移（px） */
function maxEnterXPx() {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const vw = window.innerWidth / 100
  return Math.min(6 * rem, Math.max(3 * rem, 11 * vw))
}

/** 全局进度：行程偏短 → 更早滚到「完全归位」 */
function globalScrollProgress(section) {
  const rect = section.getBoundingClientRect()
  const vh = window.innerHeight
  const startLine = vh * 0.9
  /* 行程略短：少滚一截即可跑满 p，动画更早结束 */
  const travel = vh * 1.52 + rect.height * 0.26
  return clamp01((startLine - rect.top) / travel)
}

/** 第 i 张卡在全局进度上的本地 0~1（依次出现，相邻少量交叠） */
function cardLocalT(p, index, total) {
  const step = 0.19
  const ramp = 0.3
  const span = step * (total - 1) + ramp
  const scale = span > 1 ? 1 / span : 1
  const start = index * step * scale
  const width = ramp * scale
  return clamp01((p - start) / width)
}

function applyIntro(intro, p) {
  const t = clamp01(p / 0.11)
  intro.style.opacity = String(t)
  intro.style.transform = `translate3d(0, ${(1 - t) * 22}px, 0)`
}

function applyCards(cards, p) {
  const maxX = maxEnterXPx()
  const n = cards.length
  cards.forEach((card, i) => {
    const local = cardLocalT(p, i, n)
    const sign = i % 2 === 0 ? -1 : 1
    const x = sign * maxX * (1 - local)
    const rot = sign * MAX_ROT * (1 - local)
    card.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) rotate(${rot.toFixed(3)}deg)`
    card.style.opacity = String(Math.min(1, local * 1.35))
  })
}

export function initSceneCardsReveal() {
  const section = document.querySelector('[data-scene-cards-section]')
  const intro = section?.querySelector('[data-scene-cards-intro]')
  const cards = section ? [...section.querySelectorAll('.scene-card')] : []
  if (!section || !intro || !cards.length) return

  /* 占位链接：可点、可聚焦，但不触发 # 滚顶 */
  section.querySelectorAll('.scene-card__more').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault()
    })
  })

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (reduce.matches) {
    intro.style.opacity = '1'
    intro.style.transform = 'none'
    cards.forEach((c) => {
      c.style.opacity = '1'
      c.style.transform = 'none'
    })
    return
  }

  let raf = 0
  const tick = () => {
    raf = 0
    const p = globalScrollProgress(section)
    applyIntro(intro, p)
    /* 标题仍跟全局 p；卡片在「原始 p」上晚起步，避免先 /0.72 放大再减 dead 几乎看不出 */
    const afterHold = clamp01((p - CARD_GLOBAL_HOLD) / (1 - CARD_GLOBAL_HOLD))
    const cardP = clamp01(afterHold / CARD_PHASE_COMPRESS)
    applyCards(cards, cardP)
  }

  const onScrollOrResize = () => {
    if (!raf) raf = requestAnimationFrame(tick)
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })
  reduce.addEventListener('change', () => {
    if (reduce.matches) {
      intro.style.opacity = '1'
      intro.style.transform = 'none'
      cards.forEach((c) => {
        c.style.opacity = '1'
        c.style.transform = 'none'
      })
    } else {
      tick()
    }
  })

  tick()
}
