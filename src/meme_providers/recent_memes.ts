import { Meme } from "../models/models";

const RECENT_MEME_KEY = 'com.aashreys.isthisameme.RECENT_MEME'
const NUM_RECENTS = 4

export async function getRecentMemes(): Promise<Meme[] | undefined> {
  return figma.clientStorage.getAsync(RECENT_MEME_KEY)
}

export async function addRecentMeme(meme: Meme) {
  let memes = await getRecentMemes()
  if (memes === undefined) memes = []

  // Remove meme from recents if already added
  for (let recentMeme of memes) {
    if (meme.url === recentMeme.url) {
      memes.splice(memes.indexOf(recentMeme), 1)
      break;
    }
  }

  // Add meme to first position in recents
  memes.unshift(meme)
  if (memes.length > NUM_RECENTS) {
    memes = memes.slice(0, NUM_RECENTS)
  }

  return figma.clientStorage.setAsync(RECENT_MEME_KEY, memes)
}

export function clearRecentMemes() {
  figma.clientStorage.deleteAsync(RECENT_MEME_KEY)
}