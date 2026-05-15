export function initPricingTabs() {
  const tabs = [...document.querySelectorAll('[data-pricing-type]')]
  const titles = [...document.querySelectorAll('[data-member-title][data-account-title]')]
  if (!tabs.length || !titles.length) return

  const setType = (type) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.pricingType === type
      tab.classList.toggle('pricing-tab--active', active)
      tab.setAttribute('aria-selected', active ? 'true' : 'false')
    })

    titles.forEach((title) => {
      title.textContent = type === 'account' ? title.dataset.accountTitle : title.dataset.memberTitle
    })
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setType(tab.dataset.pricingType || 'member'))
  })

  setType('member')
}
