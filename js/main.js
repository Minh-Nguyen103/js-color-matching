import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js'
import { getColorElementList, getColorListElement } from './selectors.js'
import { getRandomColorPairs } from './utils.js'

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function attachEventForColorList() {
  const ulElement = getColorListElement()
  if (!ulElement) return

  ulElement.addEventListener('click', (event) => {
    event.target.classList.add('active')
  })
}

function initColor() {
  //random 8 pairs of color
  const colorList = getRandomColorPairs(PAIRS_COUNT)

  //bind to li > div.overlay
  const liList = getColorElementList()
  if (!liList) return

  liList.forEach((liElement, index) => {
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}

;(() => {
  initColor()

  attachEventForColorList()
})()
