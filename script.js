import { updateGround, setupGround } from "./ground.js"
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js"
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js"
import {
  updateGadget,
  setupGadget,
  getGadgetRects,
  collectGadget,
} from "./gadget.js"

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")
const collectedElem = document.querySelector("[data-collected]")

let lastTime
let speedScale
let score
let isGameRunning = false

let collected = {
  phone: 0,
  laptop: 0,
  earbuds: 0,
  coin: 0,
}

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)

document.addEventListener("keydown", handleKey)
worldElem.addEventListener("pointerdown", handlePointer)

function update(time) {
  if (!isGameRunning) return

  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }

  const delta = time - lastTime

  updateGround(delta, speedScale)
  updateDino(delta, speedScale)
  updateCactus(delta, speedScale)
  updateGadget(delta, speedScale)

  updateSpeedScale(delta)
  updateScore(delta)

  if (checkLose()) {
    handleLose()
    return
  }

  checkGadgetCollect()

  lastTime = time
  window.requestAnimationFrame(update)
}

function checkLose() {
  const dinoRect = getDinoRect()

  return getCactusRects().some(rect => {
    return isCollision(rect, dinoRect, 8)
  })
}

function checkGadgetCollect() {
  const dinoRect = getDinoRect()

  getGadgetRects().forEach(({ elem, rect }) => {
    if (isCollision(rect, dinoRect, 4)) {
      const result = collectGadget(elem)

      score += result.points
      scoreElem.textContent = Math.floor(score)

      collected[result.type]++
      updateCollectedUI()
    }
  })
}

function updateCollectedUI() {
  collectedElem.textContent =
    `📱 ${collected.phone} | 💻 ${collected.laptop} | 🎧 ${collected.earbuds} | 🪙 ${collected.coin}`
}

function resetCollected() {
  collected = {
    phone: 0,
    laptop: 0,
    earbuds: 0,
    coin: 0,
  }

  updateCollectedUI()
}

function isCollision(rect1, rect2, margin = 0) {
  return (
    rect1.left + margin < rect2.right - margin &&
    rect1.top + margin < rect2.bottom - margin &&
    rect1.right - margin > rect2.left + margin &&
    rect1.bottom - margin > rect2.top + margin
  )
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
  score += delta * 0.01
  scoreElem.textContent = Math.floor(score)
}

function startGame() {
  lastTime = null
  speedScale = 1
  score = 0
  isGameRunning = true

  scoreElem.textContent = 0
  resetCollected()

  setupGround()
  setupDino()
  setupCactus()
  setupGadget()

  startScreenElem.textContent = "Press Space or Tap to Start"
  startScreenElem.classList.add("hide")

  window.requestAnimationFrame(update)
}

function handleLose() {
  isGameRunning = false
  setDinoLose()

  setTimeout(() => {
    startScreenElem.textContent = "Game Over - Press Space or Tap"
    startScreenElem.classList.remove("hide")
  }, 300)
}

function handleKey(e) {
  if (e.code !== "Space" && e.code !== "ArrowUp") return

  e.preventDefault()

  if (!isGameRunning) {
    startGame()
  }
}

function handlePointer(e) {
  e.preventDefault()

  if (!isGameRunning) {
    startGame()
  }
}

function setPixelToWorldScale() {
  const wrapper = document.querySelector(".game-wrap")

  const maxWidth = wrapper ? wrapper.clientWidth : window.innerWidth
  const maxHeight = window.innerWidth <= 600 ? 220 : 280

  const widthScale = maxWidth / WORLD_WIDTH
  const heightScale = maxHeight / WORLD_HEIGHT

  const worldToPixelScale = Math.min(widthScale, heightScale)

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}