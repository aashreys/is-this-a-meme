import { emit, on, setRelaunchButton, showUI } from '@create-figma-plugin/utilities'
import { addRecentMeme, getRecentMemes } from './meme_providers/recent_memes'

export const EVENT_MEME_CLICK = 'event_meme_click'
export const EVENT_REQUEST_RECENTS = 'event_request_recents'
export const EVENT_NEW_RECENTS = 'event_new_recents'

const TEXT_SIZE_SCALAR = 1 / 20
const TEXT_STROKE_SCALAR = 1 / 20
const TEXT_MARGIN_SCALAR = 1 / 24

export default function () {
  showUI({
    width: 400,
    height: 500
  })

  if(!('main' in figma.root.getRelaunchData())) setRelaunchButton(figma.root, 'main')

  on(EVENT_MEME_CLICK, (data) => processMemeClick(data))

  on(EVENT_REQUEST_RECENTS, () => {
    sendRecentMemesAsync()
  })
}

function processMemeClick(data: any) {
  const memeFrame: FrameNode = createMeme(
    data.meme.name,
    data.bytes,
    data.width,
    data.height
  )
  centerInViewport(memeFrame)
  addRecentMeme(data.meme)
  .then(() => {
    sendRecentMemesAsync()
  })
}

function sendRecentMemesAsync() {
  getRecentMemes().then((memes) => {
    if (memes === undefined) memes = []
    emit(EVENT_NEW_RECENTS, memes)
  })
}

function createMeme(name: string, bytes: Uint8Array, width: number, height: number): FrameNode {
  const parent = figma.createFrame()
  parent.name = name
  parent.resize(width, height)
  parent.fills = []
  const memeRect = createMemeRect(bytes, width, height)

  parent.appendChild(memeRect)
  memeRect.x = 0
  memeRect.y = 0
  memeRect.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }

  const impact: FontName = {family: 'Impact', style: 'Regular'}
  const textSize = Math.ceil((width >= height ? width : height) * TEXT_SIZE_SCALAR)
  const strokeWeight = Math.ceil(textSize * TEXT_STROKE_SCALAR)

  figma.loadFontAsync(impact)
  .then(
    () => {
      let firstLine = createText(impact, 'First Line', textSize, strokeWeight)
      parent.appendChild(firstLine)
      firstLine.x = parent.width / 2 - (firstLine.width / 2)
      firstLine.y = Math.round(parent.height * TEXT_MARGIN_SCALAR)
      firstLine.textAlignHorizontal = 'CENTER'
      firstLine.textAlignVertical = 'TOP'
      firstLine.constraints = { horizontal: 'CENTER', vertical: 'MIN' }

      let secondLine = createText(impact, 'Second Line', textSize, strokeWeight)
      parent.appendChild(secondLine)
      secondLine.x = parent.width / 2 - (secondLine.width / 2)
      secondLine.y = parent.height - Math.round(parent.height * TEXT_MARGIN_SCALAR) - secondLine.height
      secondLine.textAlignHorizontal = 'CENTER'
      secondLine.textAlignVertical = 'BOTTOM'
      secondLine.constraints = { horizontal: 'CENTER', vertical: 'MAX' }
    }
  )
  return parent
}  

function createMemeRect(bytes: Uint8Array, width: number, height: number): RectangleNode {
  const rect: RectangleNode = figma.createRectangle()
  rect.name = 'Meme'
  rect.resize(width, height)
  const newFills = []

  const imagePaint: ImagePaint = {
    type: "IMAGE",
    scaleMode: "FILL",
    imageHash: figma.createImage(bytes).hash
  }
  newFills.push(imagePaint)
  rect.fills = newFills
  return rect
}

function createText(font: FontName, text: string, size: number, strokeWeight: number): TextNode {
  const textNode = figma.createText()
  textNode.fontName = font
  textNode.characters = text
  textNode.fontSize = size
  textNode.textCase = 'UPPER'
  textNode.textAlignHorizontal = 'CENTER'

  textNode.fills = [
    {
      type: 'SOLID',
      color: { r: 1, g: 1, b: 1 }
    }
  ]

  textNode.strokes = [
    {
      type: 'SOLID',
      color: { r: 0, g: 0, b: 0 }
    }
  ]

  textNode.strokeWeight = strokeWeight

  return textNode
}

function centerInViewport(node: SceneNode) {
  node.x = Math.round(figma.viewport.bounds.x + (figma.viewport.bounds.width / 2) - (node.width / 2))
  node.y = Math.round(figma.viewport.bounds.y + (figma.viewport.bounds.height / 2) - (node.height / 2))
}