export interface Meme {
  name: string
  url: string
}

export interface MemeUIModel {
  name: string
  bytes: Uint8Array
  width: number
  height: number
}