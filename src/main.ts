import { on, setRelaunchButton, showUI } from '@create-figma-plugin/utilities'
import { Meme } from './models/meme'

export const EVENT_MEME_SEND = 'event_meme_send'

export default function () {
  showUI({
    width: 400,
    height: 500
  })
  setRelaunchButton(figma.root, 'main')

  on(EVENT_MEME_SEND, (data) => processMemeSendEvent(data))
}

function processMemeSendEvent(data: any) {
  const meme: Meme = data.meme
  const bytes = data.bytes
  console.log('meme received: ' + meme.name)
  const rect: RectangleNode = figma.createRectangle()
  rect.resize(1024, 1024)
  const newFills = []
  

  const imagePaint: ImagePaint = {
    type: "IMAGE",
    scaleMode: "FIT",
    imageHash: figma.createImage(bytes).hash
  }
  newFills.push(imagePaint)
  rect.fills = newFills
}