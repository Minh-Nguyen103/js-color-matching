import { getTimerElement, getPlayAgainButton, getInActiveColorList } from './selectors.js '

function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length < 1) return

  for (let index = arr.length - 1; index > 1; index--) {
    const j = Math.floor(Math.random() * index)

    const temp = arr[index]
    arr[index] = arr[j]
    arr[j] = temp
  }

  return arr
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  if (typeof count !== 'number' && count < 0) return []

  const colorList = []

  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  for (let i = 0; i < count; i++) {
    //randomColor function provided by lib: https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })
    colorList.push(color)
  }

  const fullColor = [...colorList, ...colorList]

  //shuffle
  shuffle(fullColor)

  return fullColor
}

export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.remove('show')
}

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.add('show')
}

export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null

  function start() {
    clear()

    let currentSeconds = seconds

    intervalId = setInterval(() => {
      onChange?.(currentSeconds)

      currentSeconds--

      if (currentSeconds < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }

  function clear() {
    clearInterval(intervalId)
  }

  return {
    start,
    clear,
  }
}
