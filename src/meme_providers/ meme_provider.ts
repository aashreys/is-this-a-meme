import { Meme } from "../models/meme";

export interface MemeProvider {

  getPopularMemes(): Promise<Meme[]>

  searchMeme(query: string): Promise<Meme[]>

}