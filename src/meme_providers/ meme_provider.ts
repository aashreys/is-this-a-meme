import { Meme } from "../models/models";

export interface MemeProvider {

  getPopularMemes(): Promise<Meme[]>

  searchMeme(query: string): Promise<Meme[]>

}