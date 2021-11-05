import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js'
import {
  getColorBackground,
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js'
import {
  getRandomColorPairs,
  hidePlayAgainButton,
  showPlayAgainButton,
  setTimerText,
  createTimer,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let time = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(seconds) {
  setTimerText(`0${seconds}s`.slice(-3))
}

function handleTimerFinish() {
  setTimerText('GAME OVER !')
  showPlayAgainButton()
  gameStatus = GAME_STATUS.FINISHED
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function resetGame() {
  //reset timer
  setTimerText('')
  //hide play again button
  hidePlayAgainButton()
  //reset gamestatus
  gameStatus = GAME_STATUS.PLAYING
  //reset game board
  const liList = getColorElementList()
  if (!liList) return

  for (const liElement of liList) {
    liElement.classList.remove('active')
  }
  initColor()

  //next game
  startGame()

  //set background color
  updateColorBackground('goldenrod')
}

function attachEvenForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.addEventListener('click', () => resetGame())
}

function updateColorBackground(color) {
  const backgroundElement = getColorBackground()
  if (backgroundElement) backgroundElement.style.backgroundColor = color
}

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  if (!liElement || shouldBlockClick) return

  liElement.classList.add('active')

  //save clicked cell to selectors
  selections.push(liElement)

  if (selections.length < 2) return

  //check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  //match
  if (isMatch) {
    //check win
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      //show You win
      time.clear()

      setTimerText('YOU WIN !')
      //show replay button
      showPlayAgainButton()
      gameStatus = GAME_STATUS.FINISHED
    }
    updateColorBackground(firstColor)
    selections = []
    return
  }

  //not match
  //remove active class for 2 li element
  gameStatus = GAME_STATUS.BLOCKING

  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    //reset selectors to next turn
    selections = []

    if (gameStatus !== GAME_STATUS.FINISHED) gameStatus = GAME_STATUS.PLAYING
  }, 250)
}

function attachEventForColorList() {
  const ulElement = getColorListElement()
  if (!ulElement) return

  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    handleColorClick(event.target)
  })
}

function initColor() {
  //random 8 pairs of color
  const colorList = getRandomColorPairs(PAIRS_COUNT)

  //bind to li > div.overlay
  const liList = getColorElementList()
  if (!liList) return

  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}

function startGame() {
  time.start()
}

;(() => {
  initColor()

  startGame()

  attachEventForColorList()

  attachEvenForPlayAgainButton()
})()
