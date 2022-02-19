import cheerio from "cheerio"
import { Meme } from "../models/meme"

const CORS_PROXY = "https://is-this-a-meme.aashreys.workers.dev/?"
const SEARCH_URL = "https://imgflip.com/search?q="

export async function searchMeme(query: string): Promise<Meme[]> {
  const memes: Meme[] = []

  let url = encodeURI(SEARCH_URL + query)
  const searchHtml = await getSearchHtml(url)
  const searchData = cheerio.load(searchHtml)
  const searchObjects = searchData('.s-result')
  searchObjects.each((index, element) => {
    if (searchData(element).attr('href')?.indexOf('/meme/') === 0) { // meme search result url
      const img = searchData(element).children('img')[0]
      memes.push({
        name: searchData(img).attr('alt')?.replace(' Meme Template', '') as string,
        url: 'https:' + searchData(img).attr('src')?.replace('/2/', '/')
      })
    }
  })

  return memes
}

function getSearchHtml(url: string) {
  return fetch(CORS_PROXY + url)
    .then((response) => response.text())
    .then((data) => { return data })
    .catch((error) => {
      console.error(error)
      return ''
    })
}