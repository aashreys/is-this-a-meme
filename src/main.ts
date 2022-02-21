import { on, setRelaunchButton, showUI } from '@create-figma-plugin/utilities'

export const EVENT_MEME_SEND = 'event_meme_send'

export default function () {
  showUI({
    width: 400,
    height: 500
  })
  setRelaunchButton(figma.root, 'main')

  on(EVENT_MEME_SEND, (data) => {
    const meme: FrameNode = createMeme(
      data.name,
      data.bytes,
      data.width,
      data.height
    )
    meme.x = Math.round(figma.viewport.bounds.x + (figma.viewport.bounds.width / 2) - (meme.width / 2))
    meme.y = Math.round(figma.viewport.bounds.y + (figma.viewport.bounds.height / 2) - (meme.height / 2))
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

  const impact: FontName = {family: 'Impact', style: 'Regular'}
  const textSize = Math.ceil((width >= height ? width : height) / 24)

  figma.loadFontAsync(impact)
  .then(
    () => {
      let firstLine = createText(impact, 'First Line', textSize)
      parent.appendChild(firstLine)
      firstLine.x = parent.width / 2 - (firstLine.width / 2)
      firstLine.y = Math.round(parent.height / 24)

      let secondLine = createText(impact, 'Second Line', textSize)
      parent.appendChild(secondLine)
      secondLine.x = parent.width / 2 - (secondLine.width / 2)
      secondLine.y = parent.height - Math.round(parent.height / 24) - secondLine.height
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
    scaleMode: "FIT",
    imageHash: figma.createImage(bytes).hash
  }
  newFills.push(imagePaint)
  rect.fills = newFills
  return rect
}

function createText(font: FontName, text: string, size: number): TextNode {
  const textNode = figma.createText()
  textNode.fontName = font
  textNode.characters = text
  textNode.fontSize = size
  textNode.textCase = 'UPPER'

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
  textNode.strokeWeight = Math.ceil(size / 24)

  return textNode
}