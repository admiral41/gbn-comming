import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

const dinoElem = document.querySelector("[data-dino]")

const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity

export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0

  dinoElem.src = "imgs/dino-stationary.png"
  setCustomProperty(dinoElem, "--bottom", 0)

  document.removeEventListener("keydown", onJump)
  document.removeEventListener("pointerdown", onPointerJump)

  document.addEventListener("keydown", onJump)
  document.addEventListener("pointerdown", onPointerJump)
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png"

  document.removeEventListener("keydown", onJump)
  document.removeEventListener("pointerdown", onPointerJump)
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = "imgs/dino-stationary.png"
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
    currentFrameTime -= FRAME_TIME
  }

  currentFrameTime += delta * speedScale
}

function handleJump(delta) {
  if (!isJumping) return

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

function jump() {
  if (isJumping) return

  yVelocity = JUMP_SPEED
  isJumping = true
}

function onJump(e) {
  if (e.code !== "Space" && e.code !== "ArrowUp") return
  e.preventDefault()
  jump()
}

function onPointerJump(e) {
  if (e.target.closest("button") || e.target.closest("input")) return
  jump()
}