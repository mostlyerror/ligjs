const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://champion.gg/champion/orianna/middle')

  const result = await page.evaluate(() => {
    const matchupNodes = $('.counter-matchups')
    const champNameNodes = matchupNodes.find('a:first-child')
    const champNames = Array.prototype.map.call(champNameNodes, (a) => a.textContent.trim())

    const winRateNodes = matchupNodes.find('.winrating-area')
    const winRates = Array.prototype.map.call(winRateNodes, (n) => n.textContent.trim())

    return champNames.reduce((acc, name, i) => {
      acc[name] = winRates[i]
      return acc
    }, {})
  })
  await browser.close()
})()
