import cheerio from "cheerio"
import { Meme } from "../models/models";
import { MemeProvider } from "./ meme_provider";

const CORS_PROXY = "https://is-this-a-meme.aashreys.workers.dev/?"
const SEARCH_URL = "https://imgflip.com/search?q="
const POPULAR_MEME_URL = 'https://api.imgflip.com/get_memes'

export class ImgFlip implements MemeProvider {

  async getPopularMemes(): Promise<Meme[]> {
    const memes: Meme[] = []

    const responseString = await this.makeHttpRequest(POPULAR_MEME_URL)
    const json = JSON.parse(responseString)
    if (json?.success) {
      for (let meme of json.data.memes) {
        memes.push({
          name: meme.name,
          url: meme.url
        })
      }
    }

    return memes;
  }


  async searchMeme(query: string): Promise<Meme[]> {
    const memes: Meme[] = []

    const searchUrl = encodeURI(SEARCH_URL + query)
    const searchHtml = await this.makeHttpRequest(CORS_PROXY + searchUrl)
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

  private makeHttpRequest(url: string): Promise<string> {
    return fetch(url)
    .then((response) => response.text())
    .then((data) => { return data })
    .catch((error) => {
      console.error(error)
      return ''
    })
  }

}