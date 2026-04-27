import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

const SPEED = 0.05
const GADGET_INTERVAL_MIN = 900
const GADGET_INTERVAL_MAX = 3000
const GADGET_POINTS = 25

const worldElem = document.querySelector("[data-world]")

const gadgets = [
  {
    type: "phone",
    src: "imgs/gadget-phone.png",
  },
  {
    type: "laptop",
    src: "imgs/gadget-laptop.png",
  },
  {
    type: "earbuds",
    src: "imgs/gadget-earbuds.png",
  },
  {
    type: "coin",
    src: "imgs/gadget-coin.png",
  },
]

let nextGadgetTime

export function setupGadget() {
  nextGadgetTime = randomNumberBetween(GADGET_INTERVAL_MIN, GADGET_INTERVAL_MAX)

  document.querySelectorAll("[data-gadget]").forEach(gadget => {
    gadget.remove()
  })
}

export function updateGadget(delta, speedScale) {
  document.querySelectorAll("[data-gadget]").forEach(gadget => {
    incrementCustomProperty(gadget, "--left", delta * speedScale * SPEED * -1)

    if (getCustomProperty(gadget, "--left") <= -20) {
      gadget.remove()
    }
  })

  nextGadgetTime -= delta

  if (nextGadgetTime <= 0) {
    createGadget()

    nextGadgetTime =
      randomNumberBetween(GADGET_INTERVAL_MIN, GADGET_INTERVAL_MAX) / speedScale
  }
}

export function getGadgetRects() {
  return [...document.querySelectorAll("[data-gadget]")].map(gadget => {
    return {
      elem: gadget,
      rect: gadget.getBoundingClientRect(),
      type: gadget.dataset.type,
    }
  })
}

export function collectGadget(gadget) {
  const rect = gadget.getBoundingClientRect()
  const worldRect = worldElem.getBoundingClientRect()

  showCollectPop(rect.left - worldRect.left, rect.top - worldRect.top)

  const type = gadget.dataset.type

  gadget.remove()

  return {
    points: GADGET_POINTS,
    type,
  }
}

function createGadget() {
  const gadget = document.createElement("img")
  const randomGadget = getRandomGadget()

  gadget.dataset.gadget = true
  gadget.dataset.type = randomGadget.type

  gadget.classList.add("gadget")
  gadget.src = randomGadget.src
  gadget.alt = randomGadget.type

  setCustomProperty(gadget, "--left", randomNumberBetween(100, 130))

  worldElem.append(gadget)
}

function getRandomGadget() {
  return gadgets[Math.floor(Math.random() * gadgets.length)]
}

function showCollectPop(x, y) {
  const pop = document.createElement("div")

  pop.className = "collect-pop"
  pop.textContent = "+25"
  pop.style.left = `${x}px`
  pop.style.top = `${y}px`

  worldElem.append(pop)

  setTimeout(() => {
    pop.remove()
  }, 700)
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}