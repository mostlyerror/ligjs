const puppeteer = require("puppeteer")

// enhance: allow permutations of roles, like 'jg' for jung,
// 'adc' for bottom', 'mid' for mid
VALID_ROLES = [
  'top',
  'middle',
  'jungle',
  'bottom',
  'support'
]

// TODO: replace this with a dynamic list..
// grab from LOL API ? cdn?
// VALID_CHAMPIONS = [
//   'sylas',
//   'orianna',
//   'jhin',
//   'lee sin',
//   'braum'
// ]

const cleanInputs = (...inputs) => {
  inputs.map((inp) => {
    if (!(typeof inp == String)) return false
    return inp.trim().toLowerCase()
  })
}
const validateInputs = (...inputs) => {
  if (inputs.length !== 2) return 'champion, role required as inputs'
  const role = inputs[1]
  if (!VALID_ROLES.includes(role)) return `role must be one of: (${VALID_ROLES.join(' | ')})`
}

async function matchups(champion, role) {
  const invalidMsg = validateInputs(champion, role)
  if (invalidMsg !== undefined) throw(`Invalid Inputs: ${invalidMsg}`)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`https://champion.gg/champion/${champion}/${role}`)

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
  return result
}

module.exports = matchups
